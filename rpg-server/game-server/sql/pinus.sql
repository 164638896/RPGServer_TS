
# Dump of table Player
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Player` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned NOT NULL DEFAULT '0',
  `typeId` varchar(10) COLLATE utf8_unicode_ci DEFAULT '0002',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `country` smallint(6) unsigned DEFAULT '0',
  `rank` smallint(6) unsigned DEFAULT '1' COMMENT 'dfsfds',
  `level` smallint(6) unsigned DEFAULT '1',
  `exp` smallint(11) unsigned DEFAULT '0',
  `atk` smallint(6) unsigned DEFAULT '0',
  `def` smallint(6) unsigned DEFAULT '0',
  `hitRate` smallint(6) unsigned DEFAULT '0',
  `dodgeRate` smallint(6) unsigned DEFAULT '0',
  `moveSpeed` smallint(6) unsigned DEFAULT '0',
  `atkSpeed` smallint(6) unsigned DEFAULT '0',
  `hp` smallint(6) unsigned DEFAULT '0',
  `mp` smallint(6) unsigned DEFAULT '0',
  `maxHp` smallint(6) unsigned DEFAULT '0',
  `maxMp` smallint(6) unsigned DEFAULT '0',
  `sceneId` bigint(20) unsigned DEFAULT '1',
  `x` float DEFAULT '0',
  `y` float DEFAULT '0',
  `z` float DEFAULT '0',
  `dirX` float DEFAULT '0',
  `dirY` float DEFAULT '0',
  `dirZ` float DEFAULT '1',
  `typeName` varchar(30) COLLATE utf8_unicode_ci DEFAULT 'god soilder',
  `skillPoint` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_GAME_NAME` (`name`),
  KEY `INDEX_PALYER_USER_ID` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


# Dump of table User
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `User` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT '',
  `loginCount` smallint(6) unsigned DEFAULT '0',
  `from` varchar(25) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastLoginTime` bigint(20) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_ACCOUNT_NAME` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

