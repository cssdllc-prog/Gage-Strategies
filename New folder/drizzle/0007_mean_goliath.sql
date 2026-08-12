CREATE TABLE `purchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`stripeCustomerId` varchar(255),
	`stripeSessionId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`type` enum('one_time','subscription') NOT NULL,
	`status` enum('active','cancelled','expired','refunded') NOT NULL DEFAULT 'active',
	`amount` decimal(10,2),
	`currency` varchar(10) DEFAULT 'usd',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`)
);
