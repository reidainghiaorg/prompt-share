CREATE TABLE `prompt_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`promptId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prompt_likes_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompt_likes_uniq` UNIQUE(`promptId`,`userId`)
);
--> statement-breakpoint
ALTER TABLE `prompts` ADD `likeCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `prompts` ADD `copyCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `slug` varchar(80);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_slug_idx` UNIQUE(`slug`);--> statement-breakpoint
CREATE INDEX `prompt_likes_user_idx` ON `prompt_likes` (`userId`);