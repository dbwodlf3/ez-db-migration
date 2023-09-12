CREATE TABLE test.user(
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `oauth_id` VARCHAR(255) NOT NULL,
    `oauth` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(20) NOT NULL UNIQUE,
    `password` VARCHAR(64) NOT NULL,
    `type` TINYINT UNSIGNED,

    `isBlocked` BOOLEAN DEFAULT FALSE,
    `isActive` BOOLEAN DEFAULT FALSE,
    `isEmailVerified` BOOLEAN DEFAULT FALSE
);

INSERT INTO `user` (`id`, `oauth_id`, `oauth`, `email`, `username`, `password`, `type`, `isBlocked`, `isActive`, `isEmailVerified`) VALUES (NULL, 'googleTestOAuthID', 'google', 'test@gmail.com', 'test', 'testPaswordSomething', NULL, '0', '0', '0');