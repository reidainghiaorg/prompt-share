CREATE TABLE `prompts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`titleEn` varchar(200) NOT NULL,
	`titleVi` varchar(200),
	`descriptionEn` text,
	`descriptionVi` text,
	`promptEn` text NOT NULL,
	`promptVi` text,
	`category` varchar(64) NOT NULL,
	`aiTools` varchar(255) NOT NULL,
	`tags` varchar(255),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`rejectionReason` text,
	`reviewedAt` timestamp,
	`reviewedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `prompts_status_idx` ON `prompts` (`status`);--> statement-breakpoint
CREATE INDEX `prompts_user_idx` ON `prompts` (`userId`);