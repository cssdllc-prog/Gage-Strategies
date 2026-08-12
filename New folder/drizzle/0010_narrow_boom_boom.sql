CREATE TABLE `companyProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255),
	`tagline` varchar(500),
	`logoUrl` varchar(512),
	`website` varchar(255),
	`email` varchar(320),
	`phone` varchar(64),
	`address` text,
	`primaryColor` varchar(32),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companyProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `companyProfiles_userId_unique` UNIQUE(`userId`)
);
