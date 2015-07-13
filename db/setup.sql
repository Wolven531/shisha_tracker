CREATE DATABASE IF NOT EXISTS `shisha_tracker` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `shisha_tracker`;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
CREATE TABLE `sizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quantity` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quantity_UNIQUE` (`quantity`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
CREATE TABLE `flavors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `size` int(11) NOT NULL,
  `company` int(11) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `date_bought` date NOT NULL,
  `bowls` int(11) NOT NULL DEFAULT '0',
  `notes` varchar(140) DEFAULT NULL,
  `date_completed` date DEFAULT NULL,
  `finished` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_flavors-sizes_idx` (`size`),
  KEY `FK_flavors-companies_idx` (`company`),
  CONSTRAINT `FK_flavors-companies` FOREIGN KEY (`company`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_flavors-sizes` FOREIGN KEY (`size`) REFERENCES `sizes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
