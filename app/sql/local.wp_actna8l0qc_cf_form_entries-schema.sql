/*!40101 SET NAMES binary*/;
/*!40014 SET FOREIGN_KEY_CHECKS=0*/;

CREATE TABLE `wp_actna8l0qc_cf_form_entries` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `form_id` varchar(18) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL,
  `datestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `form_id` (`form_id`),
  KEY `user_id` (`user_id`),
  KEY `date_time` (`datestamp`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
