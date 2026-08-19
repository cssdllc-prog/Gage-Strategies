/**
 * Image generation helper, backed by OpenAI's image API directly (no more
 * dependency on Manus's internal "forge" service).
 *
 * Example usage:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "A serene landscape with mountains"
 *   });
 *
 * For editing:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "Add a rainbow to this landscape",
 *     originalImages: [{
 *       url: "https://example.com/original.jpg",
 *       mimeType: "image/jpeg"
 *     }]
 *   });
 */
import { storagePut } from "server/storage";
import { ENV } from "./env";

const OPENAI_IMAGE_MODEL = "gpt-image-1";
const DEFAULT_IMAGE_QUALITY = "medium";

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
  /** Reserved for future multi-model support. Currently always gpt-image-1. */
  model?: string;
  /** Generation quality: "low" | "medium" | "high" | "auto". Defaults to "medium". */
  quality?: string;
};

export type GenerateImageResponse = {
  url?: string;
};

function requireOpenAiKey(): string {
  if (!ENV.openaiApiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it in your environment variables to enable image generation."
    );
  }
  return ENV.openaiApiKey;
}

/** Fetches an original image (by URL or base64) as bytes, for editing calls. */
async function resolveImageBytes(
  image: NonNullable<GenerateImageOptions["originalImages"]>[number]
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (image.b64Json) {
    return {
      buffer: Buffer.from(image.b64Json, "base64"),
      mimeType: image.mimeType || "image/png",
    };
  }
  if (image.url) {
    const response = await fetch(image.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch original image (${response.status})`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      mimeType: image.mimeType || response.headers.get("content-type") || "image/png",
    };
  }
  throw new Error("originalImages entry must include either url or b64Json");
}

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  const apiKey = requireOpenAiKey();
  const quality = options.quality ?? DEFAULT_IMAGE_QUALITY;

  let response: Response;

  if (options.originalImages && options.originalImages.length > 0) {
    // Editing an existing image: OpenAI's edit endpoint takes multipart form data.
    const form = new FormData();
    form.append("model", OPENAI_IMAGE_MODEL);
    form.append("prompt", options.prompt);
    form.append("quality", quality);

    for (const original of options.originalImages) {
      const { buffer, mimeType } = await resolveImageBytes(original);
      const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
      form.append("image[]", blob, "original.png");
    }

    response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}` },
      body: form,
    });
  } else {
    // Straightforward text-to-image generation.
    response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt: options.prompt,
        quality,
        n: 1,
      }),
    });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Image generation request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
    );
  }

  const result = (await response.json()) as {
    data: Array<{ b64_json: string }>;
  };
  const base64Data = result.data?.[0]?.b64_json;
  if (!base64Data) {
    throw new Error("OpenAI response did not include image data");
  }
  const buffer = Buffer.from(base64Data, "base64");

  // Save to S3
  const { url } = await storagePut(
    `generated/${Date.now()}.png`,
    buffer,
    "image/png"
  );
  return {
    url,
  };
}

export type ImageModelInfo = {
  model?: string;
  id?: string;
};

export type ListImageModelsResponse = {
  models: ImageModelInfo[];
};

/**
 * OpenAI doesn't expose a "list image models" endpoint the way the old
 * internal forge service did, so this simply reports the one model this
 * module currently supports. Kept for interface compatibility.
 */
export async function listImageModels(): Promise<ListImageModelsResponse> {
  requireOpenAiKey();
  return {
    models: [{ model: OPENAI_IMAGE_MODEL, id: OPENAI_IMAGE_MODEL }],
  };
}
