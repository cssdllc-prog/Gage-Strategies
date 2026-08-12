CREATE TABLE `bundles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(64),
	`productIds` text,
	`originalPrice` decimal(10,2) NOT NULL,
	`bundlePrice` decimal(10,2) NOT NULL,
	`savings` varchar(64),
	`isPopular` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bundles_id` PRIMARY KEY(`id`),
	CONSTRAINT `bundles_slug_unique` UNIQUE(`slug`)
);
