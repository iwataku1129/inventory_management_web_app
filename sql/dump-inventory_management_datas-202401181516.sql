-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 192.168.1.2    Database: inventory_management_datas
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.2-MariaDB-1:10.11.2+maria~ubu2204

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_day_report_product`
--

DROP TABLE IF EXISTS `tb_day_report_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_day_report_product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `report_date` date NOT NULL COMMENT '発生日',
  `order_product_id` int(10) unsigned NOT NULL COMMENT '製品仕入 / 納品管理id',
  `use_cnt` decimal(10,2) NOT NULL COMMENT '使用製品数',
  `day_report_product_category_id` smallint(5) unsigned DEFAULT NULL COMMENT '使用理由id',
  `remarks` varchar(1000) DEFAULT NULL COMMENT '備考',
  `disable_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '非表示flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_day_report_other_material_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_day_report_other_material_day_report_other_category_id` (`day_report_product_category_id`) USING BTREE,
  KEY `fk_tb_day_report_other_material_material_order_id` (`order_product_id`) USING BTREE,
  KEY `fk_tb_day_report_other_material_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_day_report_product_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_day_report_product_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_day_report_product_day_report_product_category_id` FOREIGN KEY (`day_report_product_category_id`) REFERENCES `tb_day_report_product_category` (`id`),
  CONSTRAINT `fk_tb_day_report_product_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_day_report_product_product_order_id` FOREIGN KEY (`order_product_id`) REFERENCES `tb_order_product` (`id`),
  CONSTRAINT `fk_tb_day_report_product_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品使用 日報 (日次)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_day_report_product`
--

LOCK TABLES `tb_day_report_product` WRITE;
/*!40000 ALTER TABLE `tb_day_report_product` DISABLE KEYS */;
INSERT INTO `tb_day_report_product` VALUES (1,1,'2024-01-19',1,10.00,1,'ああああ',0,'2024-01-18 14:15:49','2024-01-18 14:15:49',2,2),(2,1,'2024-01-18',1,10.00,1,NULL,0,'2024-01-18 14:16:52','2024-01-18 14:20:14',2,2);
/*!40000 ALTER TABLE `tb_day_report_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_day_report_product_category`
--

DROP TABLE IF EXISTS `tb_day_report_product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_day_report_product_category` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `day_report_product_category` varchar(100) NOT NULL COMMENT '使用理由カテゴリ',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_day_report_other_category_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_day_report_other_category_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_day_report_product_category_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_day_report_product_category_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_day_report_product_category_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_day_report_product_category_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='使用理由カテゴリ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_day_report_product_category`
--

LOCK TABLES `tb_day_report_product_category` WRITE;
/*!40000 ALTER TABLE `tb_day_report_product_category` DISABLE KEYS */;
INSERT INTO `tb_day_report_product_category` VALUES (1,1,'通常使用',0,'2023-12-21 11:38:57','2023-12-21 12:13:06',1,1),(2,1,'期限切れ',0,'2023-12-21 11:38:57','2023-12-21 12:13:06',1,1),(3,1,'規格外',0,'2023-12-21 11:38:57','2023-12-21 12:13:06',1,1),(4,1,'紛失・不明',0,'2023-12-21 11:38:57','2023-12-21 12:13:06',1,1),(5,1,'登録誤り訂正',0,'2023-12-21 11:38:57','2023-12-21 12:13:06',1,1),(6,1,'その他',0,'2023-12-21 11:38:57','2023-12-21 12:13:06',1,1),(7,2,'通常使用',0,'2024-01-18 14:41:35','2024-01-18 14:41:35',3,3),(8,2,'登録誤り訂正',0,'2024-01-18 14:41:35','2024-01-18 14:41:35',3,3);
/*!40000 ALTER TABLE `tb_day_report_product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_inventory_category`
--

DROP TABLE IF EXISTS `tb_inventory_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_inventory_category` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category` varchar(100) NOT NULL COMMENT '在庫管理カテゴリ',
  `inventory_category_path` varchar(100) NOT NULL COMMENT '在庫管理カテゴリ(url path)',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_inventory_category_created_by` (`created_by`),
  KEY `fk_tb_inventory_category_updated_by` (`updated_by`),
  CONSTRAINT `fk_tb_inventory_category_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_inventory_category_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='在庫管理カテゴリ(ページ)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_inventory_category`
--

LOCK TABLES `tb_inventory_category` WRITE;
/*!40000 ALTER TABLE `tb_inventory_category` DISABLE KEYS */;
INSERT INTO `tb_inventory_category` VALUES (1,'サンプル','sample','2023-12-21 10:47:17','2023-12-27 09:31:22',1,1),(2,'テスト','test','2024-01-18 14:41:35','2024-01-18 14:42:13',2,2);
/*!40000 ALTER TABLE `tb_inventory_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_order_product`
--

DROP TABLE IF EXISTS `tb_order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_order_product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `product_id` int(11) unsigned NOT NULL COMMENT '製品id',
  `order_cnt` decimal(10,2) unsigned NOT NULL COMMENT '発注数量 ※ロット',
  `order_price` int(11) NOT NULL COMMENT '仕入額 (税抜)',
  `order_date` date NOT NULL COMMENT '発注日',
  `deliver_date` date NOT NULL COMMENT '納品日 (予定含)',
  `order_check_date` date DEFAULT NULL COMMENT '検品日 (実績)',
  `order_check_cnt_unit` decimal(10,2) unsigned NOT NULL DEFAULT 0.00 COMMENT '検品数量 (実績) ※単位数値',
  `order_product_status_id` tinyint(3) unsigned NOT NULL DEFAULT 1 COMMENT '発注・納品状況id',
  `remarks` varchar(1000) DEFAULT NULL COMMENT '備考',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_order_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_order_material_id` (`product_id`) USING BTREE,
  KEY `fk_tb_material_order_material_order_status_id` (`order_product_status_id`) USING BTREE,
  KEY `fk_tb_material_order_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_order_product_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_order_product_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_order_product_order_product_status_id` FOREIGN KEY (`order_product_status_id`) REFERENCES `tb_order_product_status` (`id`),
  CONSTRAINT `fk_tb_product_order_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_product_order_product_id` FOREIGN KEY (`product_id`) REFERENCES `tb_product_master_hist` (`id`),
  CONSTRAINT `fk_tb_product_order_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='仕入 / 納品管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_order_product`
--

LOCK TABLES `tb_order_product` WRITE;
/*!40000 ALTER TABLE `tb_order_product` DISABLE KEYS */;
INSERT INTO `tb_order_product` VALUES (1,1,1,2.00,3000,'2024-01-18','2024-01-18','2024-01-18',200.00,3,'めもめも\n','2024-01-18 14:14:29','2024-01-18 14:19:08',2,2);
/*!40000 ALTER TABLE `tb_order_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_order_product_status`
--

DROP TABLE IF EXISTS `tb_order_product_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_order_product_status` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `order_product_status` varchar(100) NOT NULL COMMENT '発注・納品状況',
  `phase` enum('order','check','complete','cancel') NOT NULL COMMENT 'ステータスフェーズ',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_order_status_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_order_status_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_product_order_status_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_product_order_status_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_product_order_status_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_order_status_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='発注・納品状況';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_order_product_status`
--

LOCK TABLES `tb_order_product_status` WRITE;
/*!40000 ALTER TABLE `tb_order_product_status` DISABLE KEYS */;
INSERT INTO `tb_order_product_status` VALUES (1,1,'1.発注済','order',0,'2023-12-21 11:29:15','2023-12-21 12:14:16',1,1),(2,1,'2.納品済','check',0,'2023-12-21 11:29:15','2023-12-21 12:14:16',1,1),(3,1,'3.検品済','complete',0,'2023-12-21 11:29:15','2023-12-21 12:14:16',1,1),(4,1,'999.キャンセル','cancel',0,'2023-12-21 11:29:15','2023-12-21 12:14:16',1,1),(5,2,'1.発注済','order',0,'2024-01-18 14:41:35','2024-01-18 14:41:35',3,3),(6,2,'2.納品済','check',0,'2024-01-18 14:41:35','2024-01-18 14:41:35',3,3),(7,2,'3.検品済','complete',0,'2024-01-18 14:41:35','2024-01-18 14:41:35',3,3),(8,2,'999.キャンセル','cancel',0,'2024-01-18 14:41:35','2024-01-18 14:41:35',3,3);
/*!40000 ALTER TABLE `tb_order_product_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_product_category_1`
--

DROP TABLE IF EXISTS `tb_product_category_1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_product_category_1` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `product_category_1` varchar(100) NOT NULL COMMENT '製品カテゴリ1',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_category_1_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_category_1_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_product_category_1_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_product_category_1_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_product_category_1_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_category_1_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品カテゴリ1';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_product_category_1`
--

LOCK TABLES `tb_product_category_1` WRITE;
/*!40000 ALTER TABLE `tb_product_category_1` DISABLE KEYS */;
INSERT INTO `tb_product_category_1` VALUES (1,1,'製品カテゴリ1',0,'2024-01-18 14:12:17','2024-01-18 14:12:17',2,2);
/*!40000 ALTER TABLE `tb_product_category_1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_product_category_2`
--

DROP TABLE IF EXISTS `tb_product_category_2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_product_category_2` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `product_category_2` varchar(100) NOT NULL COMMENT '製品カテゴリ2',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_category_1_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_category_1_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_product_category_2_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_product_category_2_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_product_category_2_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_category_2_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品カテゴリ2';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_product_category_2`
--

LOCK TABLES `tb_product_category_2` WRITE;
/*!40000 ALTER TABLE `tb_product_category_2` DISABLE KEYS */;
INSERT INTO `tb_product_category_2` VALUES (1,1,'製品カテゴリ2',0,'2024-01-18 14:12:27','2024-01-18 14:12:27',2,2);
/*!40000 ALTER TABLE `tb_product_category_2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_product_category_3`
--

DROP TABLE IF EXISTS `tb_product_category_3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_product_category_3` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `product_category_3` varchar(100) NOT NULL COMMENT '製品カテゴリ3',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_category_1_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_category_1_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_product_category_3_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_product_category_3_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_product_category_3_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_category_3_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品カテゴリ3';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_product_category_3`
--

LOCK TABLES `tb_product_category_3` WRITE;
/*!40000 ALTER TABLE `tb_product_category_3` DISABLE KEYS */;
INSERT INTO `tb_product_category_3` VALUES (1,1,'製品カテゴリ3',0,'2024-01-18 14:12:44','2024-01-18 14:12:44',2,2);
/*!40000 ALTER TABLE `tb_product_category_3` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_product_kamoku_category`
--

DROP TABLE IF EXISTS `tb_product_kamoku_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_product_kamoku_category` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(6) unsigned NOT NULL,
  `product_kamoku_category` varchar(100) NOT NULL COMMENT '科目カテゴリ',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_kamoku_category_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_kamoku_category_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_product_kamoku_category_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_product_kamoku_category_creatrd_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_product_kamoku_category_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_kamoku_category_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品 科目カテゴリ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_product_kamoku_category`
--

LOCK TABLES `tb_product_kamoku_category` WRITE;
/*!40000 ALTER TABLE `tb_product_kamoku_category` DISABLE KEYS */;
INSERT INTO `tb_product_kamoku_category` VALUES (1,1,'科目名1',0,'2024-01-18 14:12:07','2024-01-18 14:12:07',2,2);
/*!40000 ALTER TABLE `tb_product_kamoku_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_product_master_hist`
--

DROP TABLE IF EXISTS `tb_product_master_hist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_product_master_hist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `supplier_id` smallint(5) unsigned NOT NULL COMMENT '取引先id',
  `product_code` varchar(100) NOT NULL COMMENT '製品管理コード',
  `product_name` varchar(100) NOT NULL COMMENT '製品名',
  `unit` varchar(100) NOT NULL DEFAULT 'g' COMMENT '単位',
  `contents` decimal(10,2) unsigned NOT NULL DEFAULT 1.00 COMMENT '質量',
  `ratio` smallint(6) unsigned NOT NULL DEFAULT 100 COMMENT '部歩率(%)',
  `remarks` varchar(1000) DEFAULT NULL COMMENT '備考',
  `tax_par` smallint(6) unsigned NOT NULL DEFAULT 8 COMMENT '消費税率',
  `product_kamoku_category_id` smallint(6) unsigned DEFAULT NULL COMMENT '科目カテゴリID',
  `product_category_1_id` smallint(5) unsigned DEFAULT NULL COMMENT '製品カテゴリ(1)ID',
  `product_category_2_id` smallint(5) unsigned DEFAULT NULL COMMENT '製品カテゴリ(2)ID',
  `product_category_3_id` smallint(5) unsigned DEFAULT NULL COMMENT '製品カテゴリ(3)ID',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_product_masetr_supplier_id` (`supplier_id`),
  KEY `fk_tb_product_masetr_inventory_category_id` (`inventory_category_id`),
  KEY `fk_tb_product_masetr_product_kamoku_category_id` (`product_kamoku_category_id`),
  KEY `fk_tb_product_masetr_product_category_1_id` (`product_category_1_id`),
  KEY `fk_tb_product_masetr_product_category_2_id` (`product_category_2_id`),
  KEY `fK_tb_product_masetr_product_category_3_id` (`product_category_3_id`),
  CONSTRAINT `fK_tb_product_masetr_product_category_3_id` FOREIGN KEY (`product_category_3_id`) REFERENCES `tb_product_category_3` (`id`),
  CONSTRAINT `fk_tb_product_masetr_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_masetr_product_category_1_id` FOREIGN KEY (`product_category_1_id`) REFERENCES `tb_product_category_1` (`id`),
  CONSTRAINT `fk_tb_product_masetr_product_category_2_id` FOREIGN KEY (`product_category_2_id`) REFERENCES `tb_product_category_2` (`id`),
  CONSTRAINT `fk_tb_product_masetr_product_kamoku_category_id` FOREIGN KEY (`product_kamoku_category_id`) REFERENCES `tb_product_kamoku_category` (`id`),
  CONSTRAINT `fk_tb_product_masetr_supplier_id` FOREIGN KEY (`supplier_id`) REFERENCES `tb_supplier_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品一覧';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_product_master_hist`
--

LOCK TABLES `tb_product_master_hist` WRITE;
/*!40000 ALTER TABLE `tb_product_master_hist` DISABLE KEYS */;
INSERT INTO `tb_product_master_hist` VALUES (1,1,1,'1234','製品名1','個',100.00,100,'めもめも\n',10,1,1,1,1,0,'2024-01-18 14:13:46','2024-01-18 14:13:46',2,2);
/*!40000 ALTER TABLE `tb_product_master_hist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_product_master_now`
--

DROP TABLE IF EXISTS `tb_product_master_now`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_product_master_now` (
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `product_code` varchar(100) NOT NULL COMMENT '製品管理Code',
  `product_id` int(11) unsigned NOT NULL COMMENT '製品id (履歴)',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  PRIMARY KEY (`inventory_category_id`,`product_code`),
  KEY `fk_tb_material_master_now_material_id` (`product_id`) USING BTREE,
  CONSTRAINT `fk_tb_product_master_now_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_product_master_now_product_id` FOREIGN KEY (`product_id`) REFERENCES `tb_product_master_hist` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品マスタ (最新値)\r\n※tb_product_master_hist更新をトリガに書換';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_product_master_now`
--

LOCK TABLES `tb_product_master_now` WRITE;
/*!40000 ALTER TABLE `tb_product_master_now` DISABLE KEYS */;
INSERT INTO `tb_product_master_now` VALUES (1,'1234',1,'2024-01-18 14:13:46','2024-01-18 14:13:46');
/*!40000 ALTER TABLE `tb_product_master_now` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_supplier_master`
--

DROP TABLE IF EXISTS `tb_supplier_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_supplier_master` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(6) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `supplier_code` varchar(100) NOT NULL COMMENT '製品取引先コード',
  `corporation_code` varchar(100) DEFAULT NULL COMMENT '法人番号',
  `Invoice_code` varchar(100) DEFAULT NULL COMMENT '適格事業者番号',
  `supplier_name` varchar(100) NOT NULL COMMENT '製品取引先名',
  `remarks` varchar(1000) DEFAULT NULL COMMENT '備考',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(6) unsigned NOT NULL COMMENT '登録者ID',
  `updated_by` smallint(6) unsigned NOT NULL COMMENT '更新者ID',
  PRIMARY KEY (`id`),
  KEY `fk_tb_material_supplier_name_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_material_supplier_name_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_supplier_master_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_supplier_master_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_supplier_master_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_supplier_master_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='製品取引先';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_supplier_master`
--

LOCK TABLES `tb_supplier_master` WRITE;
/*!40000 ALTER TABLE `tb_supplier_master` DISABLE KEYS */;
INSERT INTO `tb_supplier_master` VALUES (1,1,'A0001',NULL,NULL,'xxx商事',NULL,0,'2024-01-18 14:11:56','2024-01-18 14:11:56',2,2);
/*!40000 ALTER TABLE `tb_supplier_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_user_master`
--

DROP TABLE IF EXISTS `tb_user_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_user_master` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `inventory_category_id` smallint(5) unsigned NOT NULL COMMENT '在庫管理カテゴリid',
  `user_name` varchar(100) NOT NULL COMMENT 'ユーザ名',
  `email` varchar(100) NOT NULL COMMENT 'メール',
  `del_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '削除flg',
  `disable_flg` tinyint(1) NOT NULL DEFAULT 0 COMMENT '非表示',
  `priority` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT '表示優先順位',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT '登録日',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT '最終更新日',
  `created_by` smallint(5) unsigned NOT NULL,
  `updated_by` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tb_user_master_created_by` (`created_by`) USING BTREE,
  KEY `fk_tb_user_master_updated_by` (`updated_by`) USING BTREE,
  KEY `fk_tb_user_master_inventory_category_id` (`inventory_category_id`),
  CONSTRAINT `fk_tb_user_master_created_by` FOREIGN KEY (`created_by`) REFERENCES `tb_user_master` (`id`),
  CONSTRAINT `fk_tb_user_master_inventory_category_id` FOREIGN KEY (`inventory_category_id`) REFERENCES `tb_inventory_category` (`id`),
  CONSTRAINT `fk_tb_user_master_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `tb_user_master` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ユーザ情報';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_user_master`
--

LOCK TABLES `tb_user_master` WRITE;
/*!40000 ALTER TABLE `tb_user_master` DISABLE KEYS */;
INSERT INTO `tb_user_master` VALUES (1,1,'system','admin@xxx.com',0,0,255,'2023-12-21 10:48:14','2024-01-18 10:53:10',1,1),(2,1,'TakumaIwai','t.iwai@xxx.com',0,0,255,'2024-01-18 14:10:58','2024-01-18 14:10:58',1,1),(3,2,'system','admin@xxx.com',0,0,255,'2024-01-18 14:41:35','2024-01-18 14:41:35',1,1),(4,2,'TakumaIwai','t.iwai@xxx.com',0,0,254,'2024-01-18 14:41:36','2024-01-18 14:41:36',2,2);
/*!40000 ALTER TABLE `tb_user_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_day_report_product`
--

DROP TABLE IF EXISTS `v_day_report_product`;
/*!50001 DROP VIEW IF EXISTS `v_day_report_product`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_day_report_product` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `report_date`,
 1 AS `order_product_id`,
 1 AS `product_id`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `unit`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category_id`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1_id`,
 1 AS `product_category_1`,
 1 AS `product_category_2_id`,
 1 AS `product_category_2`,
 1 AS `product_category_3_id`,
 1 AS `product_category_3`,
 1 AS `order_price`,
 1 AS `order_check_date`,
 1 AS `deliver_date`,
 1 AS `order_check_cnt_unit`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `cost`,
 1 AS `use_cnt`,
 1 AS `use_cnt_all`,
 1 AS `stock_cnt`,
 1 AS `day_report_product_category_id`,
 1 AS `day_report_product_category`,
 1 AS `remarks`,
 1 AS `disable_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_day_report_product_category`
--

DROP TABLE IF EXISTS `v_day_report_product_category`;
/*!50001 DROP VIEW IF EXISTS `v_day_report_product_category`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_day_report_product_category` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `day_report_product_category`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_inventory_category`
--

DROP TABLE IF EXISTS `v_inventory_category`;
/*!50001 DROP VIEW IF EXISTS `v_inventory_category`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_inventory_category` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_order_product`
--

DROP TABLE IF EXISTS `v_order_product`;
/*!50001 DROP VIEW IF EXISTS `v_order_product`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_order_product` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `product_id`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `unit`,
 1 AS `contents`,
 1 AS `ratio`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category_id`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1_id`,
 1 AS `product_category_1`,
 1 AS `product_category_2_id`,
 1 AS `product_category_2`,
 1 AS `product_category_3_id`,
 1 AS `product_category_3`,
 1 AS `order_cnt`,
 1 AS `order_cnt_unit`,
 1 AS `order_price`,
 1 AS `order_check_price_unit`,
 1 AS `order_date`,
 1 AS `deliver_date`,
 1 AS `order_check_date`,
 1 AS `order_check_cnt_unit`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `remarks`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_order_product_month`
--

DROP TABLE IF EXISTS `v_order_product_month`;
/*!50001 DROP VIEW IF EXISTS `v_order_product_month`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_order_product_month` AS SELECT 
 1 AS `ids`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `deliver_month`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `product_id`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `unit`,
 1 AS `tax_par`,
 1 AS `order_price`,
 1 AS `order_check_price_unit`,
 1 AS `order_check_cnt_unit`,
 1 AS `order_cnt`,
 1 AS `order_cnt_unit`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_order_product_status`
--

DROP TABLE IF EXISTS `v_order_product_status`;
/*!50001 DROP VIEW IF EXISTS `v_order_product_status`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_order_product_status` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_order_product_supplier_month`
--

DROP TABLE IF EXISTS `v_order_product_supplier_month`;
/*!50001 DROP VIEW IF EXISTS `v_order_product_supplier_month`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_order_product_supplier_month` AS SELECT 
 1 AS `ids`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `deliver_month`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `order_price`,
 1 AS `tax_par`,
 1 AS `order_check_price_unit`,
 1 AS `order_check_cnt_unit`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_category_1`
--

DROP TABLE IF EXISTS `v_product_category_1`;
/*!50001 DROP VIEW IF EXISTS `v_product_category_1`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_category_1` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `product_category_1`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_category_2`
--

DROP TABLE IF EXISTS `v_product_category_2`;
/*!50001 DROP VIEW IF EXISTS `v_product_category_2`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_category_2` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `product_category_2`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_category_3`
--

DROP TABLE IF EXISTS `v_product_category_3`;
/*!50001 DROP VIEW IF EXISTS `v_product_category_3`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_category_3` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `product_category_3`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_kamoku_category`
--

DROP TABLE IF EXISTS `v_product_kamoku_category`;
/*!50001 DROP VIEW IF EXISTS `v_product_kamoku_category`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_kamoku_category` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `product_kamoku_category`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_master_hist`
--

DROP TABLE IF EXISTS `v_product_master_hist`;
/*!50001 DROP VIEW IF EXISTS `v_product_master_hist`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_master_hist` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `unit`,
 1 AS `contents`,
 1 AS `ratio`,
 1 AS `remarks`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category_id`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1_id`,
 1 AS `product_category_1`,
 1 AS `product_category_2_id`,
 1 AS `product_category_2`,
 1 AS `product_category_3_id`,
 1 AS `product_category_3`,
 1 AS `product_id_now`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_product_master_now`
--

DROP TABLE IF EXISTS `v_product_master_now`;
/*!50001 DROP VIEW IF EXISTS `v_product_master_now`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_product_master_now` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `unit`,
 1 AS `contents`,
 1 AS `ratio`,
 1 AS `remarks`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category_id`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1_id`,
 1 AS `product_category_1`,
 1 AS `product_category_2_id`,
 1 AS `product_category_2`,
 1 AS `product_category_3_id`,
 1 AS `product_category_3`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_report_hist_product`
--

DROP TABLE IF EXISTS `v_report_hist_product`;
/*!50001 DROP VIEW IF EXISTS `v_report_hist_product`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_report_hist_product` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `order_id`,
 1 AS `report_date`,
 1 AS `category_name`,
 1 AS `product_id`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `unit`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category_id`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1_id`,
 1 AS `product_category_1`,
 1 AS `product_category_2_id`,
 1 AS `product_category_2`,
 1 AS `product_category_3_id`,
 1 AS `product_category_3`,
 1 AS `order_check_price_unit`,
 1 AS `stock_cnt`,
 1 AS `use_cnt`,
 1 AS `calc_cnt`,
 1 AS `stock_price`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_report_stock_product`
--

DROP TABLE IF EXISTS `v_report_stock_product`;
/*!50001 DROP VIEW IF EXISTS `v_report_stock_product`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_report_stock_product` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `order_check_date`,
 1 AS `deliver_date`,
 1 AS `product_id`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `unit`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category_id`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1_id`,
 1 AS `product_category_1`,
 1 AS `product_category_2_id`,
 1 AS `product_category_2`,
 1 AS `product_category_3_id`,
 1 AS `product_category_3`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `order_price`,
 1 AS `order_check_cnt_unit`,
 1 AS `order_check_price_unit`,
 1 AS `use_cnt`,
 1 AS `stock_cnt`,
 1 AS `stock_price`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_report_stock_product_group`
--

DROP TABLE IF EXISTS `v_report_stock_product_group`;
/*!50001 DROP VIEW IF EXISTS `v_report_stock_product_group`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_report_stock_product_group` AS SELECT 
 1 AS `ids`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `product_ids`,
 1 AS `product_code`,
 1 AS `product_name`,
 1 AS `supplier_id`,
 1 AS `supplier_code`,
 1 AS `supplier_name`,
 1 AS `unit`,
 1 AS `tax_par`,
 1 AS `product_kamoku_category`,
 1 AS `product_category_1`,
 1 AS `product_category_2`,
 1 AS `product_category_3`,
 1 AS `order_product_status_id`,
 1 AS `order_product_status`,
 1 AS `phase`,
 1 AS `order_price`,
 1 AS `order_check_cnt_unit`,
 1 AS `order_check_price_unit`,
 1 AS `use_cnt`,
 1 AS `stock_cnt`,
 1 AS `stock_price`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_supplier_master`
--

DROP TABLE IF EXISTS `v_supplier_master`;
/*!50001 DROP VIEW IF EXISTS `v_supplier_master`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_supplier_master` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `supplier_code`,
 1 AS `corporation_code`,
 1 AS `Invoice_code`,
 1 AS `supplier_name`,
 1 AS `remarks`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_user_master`
--

DROP TABLE IF EXISTS `v_user_master`;
/*!50001 DROP VIEW IF EXISTS `v_user_master`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_user_master` AS SELECT 
 1 AS `id`,
 1 AS `inventory_category_id`,
 1 AS `inventory_category`,
 1 AS `inventory_category_path`,
 1 AS `user_name`,
 1 AS `email`,
 1 AS `priority`,
 1 AS `disable_flg`,
 1 AS `del_flg`,
 1 AS `created_at`,
 1 AS `updated_at`,
 1 AS `created_by`,
 1 AS `updated_by`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'inventory_management_datas'
--

--
-- Final view structure for view `v_day_report_product`
--

/*!50001 DROP VIEW IF EXISTS `v_day_report_product`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_day_report_product` AS select `day_rep`.`id` AS `id`,`day_rep`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`day_rep`.`report_date` AS `report_date`,`day_rep`.`order_product_id` AS `order_product_id`,`order_prd`.`product_id` AS `product_id`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`unit` AS `unit`,`product`.`tax_par` AS `tax_par`,`product`.`product_kamoku_category_id` AS `product_kamoku_category_id`,`kamoku`.`product_kamoku_category` AS `product_kamoku_category`,`product`.`product_category_1_id` AS `product_category_1_id`,`prd_cat_1`.`product_category_1` AS `product_category_1`,`product`.`product_category_2_id` AS `product_category_2_id`,`prd_cat_2`.`product_category_2` AS `product_category_2`,`product`.`product_category_3_id` AS `product_category_3_id`,`prd_cat_3`.`product_category_3` AS `product_category_3`,`order_prd`.`order_price` AS `order_price`,`order_prd`.`order_check_date` AS `order_check_date`,`order_prd`.`deliver_date` AS `deliver_date`,`order_prd`.`order_check_cnt_unit` AS `order_check_cnt_unit`,`order_prd`.`order_product_status_id` AS `order_product_status_id`,`order_prd_sts`.`order_product_status` AS `order_product_status`,ifnull(`order_prd`.`order_price` / `order_prd`.`order_check_cnt_unit` * `day_rep`.`use_cnt`,0) AS `cost`,`day_rep`.`use_cnt` AS `use_cnt`,`day_rep_all`.`use_cnt` AS `use_cnt_all`,coalesce(`order_prd`.`order_check_cnt_unit`,0) - coalesce(`day_rep_all`.`use_cnt`,0) AS `stock_cnt`,`day_rep`.`day_report_product_category_id` AS `day_report_product_category_id`,`prd_cat`.`day_report_product_category` AS `day_report_product_category`,`day_rep`.`remarks` AS `remarks`,`day_rep`.`disable_flg` AS `disable_flg`,`day_rep`.`created_at` AS `created_at`,`day_rep`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((((((((((((`tb_day_report_product` `day_rep` join `tb_inventory_category` `inv_cat` on(`day_rep`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_order_product` `order_prd` on(`day_rep`.`order_product_id` = `order_prd`.`id` and `day_rep`.`inventory_category_id` = `order_prd`.`inventory_category_id`)) join `tb_product_master_hist` `product` on(`order_prd`.`product_id` = `product`.`id` and `day_rep`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `day_rep`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `day_rep`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `prd_cat_1` on(`product`.`product_category_1_id` = `prd_cat_1`.`id` and `day_rep`.`inventory_category_id` = `prd_cat_1`.`inventory_category_id`)) left join `tb_product_category_2` `prd_cat_2` on(`product`.`product_category_2_id` = `prd_cat_2`.`id` and `day_rep`.`inventory_category_id` = `prd_cat_2`.`inventory_category_id`)) left join `tb_product_category_3` `prd_cat_3` on(`product`.`product_category_3_id` = `prd_cat_3`.`id` and `day_rep`.`inventory_category_id` = `prd_cat_3`.`inventory_category_id`)) join `tb_order_product_status` `order_prd_sts` on(`order_prd`.`order_product_status_id` = `order_prd_sts`.`id`)) left join `tb_day_report_product_category` `prd_cat` on(`day_rep`.`day_report_product_category_id` = `prd_cat`.`id` and `day_rep`.`inventory_category_id` = `prd_cat`.`inventory_category_id`)) left join (select `x`.`order_product_id` AS `order_product_id`,`x`.`inventory_category_id` AS `inventory_category_id`,sum(`x`.`use_cnt`) AS `use_cnt` from `tb_day_report_product` `x` group by `x`.`inventory_category_id`,`x`.`order_product_id`) `day_rep_all` on(`day_rep`.`order_product_id` = `day_rep_all`.`order_product_id` and `day_rep`.`inventory_category_id` = `day_rep_all`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`day_rep`.`created_by` = `created_by`.`id` and `day_rep`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`day_rep`.`updated_by` = `updated_by`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_day_report_product_category`
--

/*!50001 DROP VIEW IF EXISTS `v_day_report_product_category`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_day_report_product_category` AS select `cat`.`id` AS `id`,`cat`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`cat`.`day_report_product_category` AS `day_report_product_category`,`cat`.`del_flg` AS `del_flg`,`cat`.`created_at` AS `created_at`,`cat`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_day_report_product_category` `cat` join `tb_inventory_category` `inv_cat` on(`cat`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`cat`.`created_by` = `created_by`.`id` and `cat`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`cat`.`updated_by` = `updated_by`.`id` and `cat`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_inventory_category`
--

/*!50001 DROP VIEW IF EXISTS `v_inventory_category`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_inventory_category` AS select `cat`.`id` AS `id`,`cat`.`inventory_category` AS `inventory_category`,`cat`.`inventory_category_path` AS `inventory_category_path`,`cat`.`created_at` AS `created_at`,`cat`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from ((`tb_inventory_category` `cat` join `tb_user_master` `created_by` on(`cat`.`created_by` = `created_by`.`id`)) join `tb_user_master` `updated_by` on(`cat`.`updated_by` = `updated_by`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_order_product`
--

/*!50001 DROP VIEW IF EXISTS `v_order_product`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_order_product` AS select `orders`.`id` AS `id`,`orders`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`orders`.`product_id` AS `product_id`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`unit` AS `unit`,`product`.`contents` AS `contents`,`product`.`ratio` AS `ratio`,`product`.`tax_par` AS `tax_par`,`product`.`product_kamoku_category_id` AS `product_kamoku_category_id`,`kamoku`.`product_kamoku_category` AS `product_kamoku_category`,`product`.`product_category_1_id` AS `product_category_1_id`,`cat1`.`product_category_1` AS `product_category_1`,`product`.`product_category_2_id` AS `product_category_2_id`,`cat2`.`product_category_2` AS `product_category_2`,`product`.`product_category_3_id` AS `product_category_3_id`,`cat3`.`product_category_3` AS `product_category_3`,`orders`.`order_cnt` AS `order_cnt`,round(`orders`.`order_cnt` * `product`.`contents`,2) AS `order_cnt_unit`,`orders`.`order_price` AS `order_price`,ifnull(`orders`.`order_price` / `orders`.`order_check_cnt_unit`,0) AS `order_check_price_unit`,`orders`.`order_date` AS `order_date`,`orders`.`deliver_date` AS `deliver_date`,`orders`.`order_check_date` AS `order_check_date`,`orders`.`order_check_cnt_unit` AS `order_check_cnt_unit`,`orders`.`order_product_status_id` AS `order_product_status_id`,`status`.`order_product_status` AS `order_product_status`,`status`.`phase` AS `phase`,`orders`.`remarks` AS `remarks`,`orders`.`created_at` AS `created_at`,`orders`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from ((((((((((`tb_order_product` `orders` join `tb_inventory_category` `inv_cat` on(`orders`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_product_master_hist` `product` on(`orders`.`product_id` = `product`.`id` and `orders`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `orders`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `orders`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `cat1` on(`product`.`product_category_1_id` = `cat1`.`id` and `orders`.`inventory_category_id` = `cat1`.`inventory_category_id`)) left join `tb_product_category_2` `cat2` on(`product`.`product_category_2_id` = `cat2`.`id` and `orders`.`inventory_category_id` = `cat2`.`inventory_category_id`)) left join `tb_product_category_3` `cat3` on(`product`.`product_category_3_id` = `cat3`.`id` and `orders`.`inventory_category_id` = `cat3`.`inventory_category_id`)) join `tb_order_product_status` `status` on(`orders`.`order_product_status_id` = `status`.`id` and `orders`.`inventory_category_id` = `status`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`orders`.`created_by` = `created_by`.`id` and `orders`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`orders`.`updated_by` = `updated_by`.`id` and `orders`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_order_product_month`
--

/*!50001 DROP VIEW IF EXISTS `v_order_product_month`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_order_product_month` AS select group_concat(`orders`.`id` separator ',') AS `ids`,`orders`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,date_format(`orders`.`deliver_date`,'%Y-%m') AS `deliver_month`,`orders`.`order_product_status_id` AS `order_product_status_id`,`status`.`order_product_status` AS `order_product_status`,`status`.`phase` AS `phase`,`orders`.`product_id` AS `product_id`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`unit` AS `unit`,`product`.`tax_par` AS `tax_par`,sum(`orders`.`order_price`) AS `order_price`,ifnull(sum(`orders`.`order_price`) / sum(`orders`.`order_check_cnt_unit`),0) AS `order_check_price_unit`,sum(`orders`.`order_check_cnt_unit`) AS `order_check_cnt_unit`,sum(`orders`.`order_cnt`) AS `order_cnt`,round(sum(`orders`.`order_cnt` * `product`.`contents`),2) AS `order_cnt_unit`,`orders`.`created_at` AS `created_at`,`orders`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from ((((((`tb_order_product` `orders` join `tb_inventory_category` `inv_cat` on(`orders`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_product_master_hist` `product` on(`orders`.`product_id` = `product`.`id` and `orders`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `orders`.`inventory_category_id` = `supplier`.`inventory_category_id`)) join `tb_order_product_status` `status` on(`orders`.`order_product_status_id` = `status`.`id` and `orders`.`inventory_category_id` = `status`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`orders`.`created_by` = `created_by`.`id` and `orders`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`orders`.`updated_by` = `updated_by`.`id` and `orders`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) group by `orders`.`inventory_category_id`,`orders`.`order_product_status_id`,date_format(`orders`.`deliver_date`,'%Y-%m'),`product`.`product_code`,`product`.`supplier_id`,`product`.`unit`,`product`.`tax_par` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_order_product_status`
--

/*!50001 DROP VIEW IF EXISTS `v_order_product_status`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_order_product_status` AS select `status`.`id` AS `id`,`status`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`status`.`order_product_status` AS `order_product_status`,`status`.`phase` AS `phase`,`status`.`del_flg` AS `del_flg`,`status`.`created_at` AS `created_at`,`status`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_order_product_status` `status` join `tb_inventory_category` `inv_cat` on(`status`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`status`.`created_by` = `created_by`.`id` and `status`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`status`.`updated_by` = `updated_by`.`id` and `status`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_order_product_supplier_month`
--

/*!50001 DROP VIEW IF EXISTS `v_order_product_supplier_month`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_order_product_supplier_month` AS select group_concat(`orders`.`id` separator ',') AS `ids`,`orders`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,date_format(`orders`.`deliver_date`,'%Y-%m') AS `deliver_month`,`orders`.`order_product_status_id` AS `order_product_status_id`,`status`.`order_product_status` AS `order_product_status`,`status`.`phase` AS `phase`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,sum(`orders`.`order_price`) AS `order_price`,`product`.`tax_par` AS `tax_par`,ifnull(sum(`orders`.`order_price`) / sum(`orders`.`order_check_cnt_unit`),0) AS `order_check_price_unit`,sum(`orders`.`order_check_cnt_unit`) AS `order_check_cnt_unit`,`orders`.`created_at` AS `created_at`,`orders`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from ((((((`tb_order_product` `orders` join `tb_inventory_category` `inv_cat` on(`orders`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_product_master_hist` `product` on(`orders`.`product_id` = `product`.`id` and `orders`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `orders`.`inventory_category_id` = `supplier`.`inventory_category_id`)) join `tb_order_product_status` `status` on(`orders`.`order_product_status_id` = `status`.`id` and `orders`.`inventory_category_id` = `status`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`orders`.`created_by` = `created_by`.`id` and `orders`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`orders`.`updated_by` = `updated_by`.`id` and `orders`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) group by `orders`.`inventory_category_id`,`orders`.`order_product_status_id`,date_format(`orders`.`deliver_date`,'%Y-%m'),`product`.`supplier_id`,`product`.`tax_par` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_category_1`
--

/*!50001 DROP VIEW IF EXISTS `v_product_category_1`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_category_1` AS select `cat`.`id` AS `id`,`cat`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`cat`.`product_category_1` AS `product_category_1`,`cat`.`del_flg` AS `del_flg`,`cat`.`created_at` AS `created_at`,`cat`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_product_category_1` `cat` join `tb_inventory_category` `inv_cat` on(`cat`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`cat`.`created_by` = `created_by`.`id` and `cat`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`cat`.`updated_by` = `updated_by`.`id` and `cat`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_category_2`
--

/*!50001 DROP VIEW IF EXISTS `v_product_category_2`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_category_2` AS select `cat`.`id` AS `id`,`cat`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`cat`.`product_category_2` AS `product_category_2`,`cat`.`del_flg` AS `del_flg`,`cat`.`created_at` AS `created_at`,`cat`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_product_category_2` `cat` join `tb_inventory_category` `inv_cat` on(`cat`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`cat`.`created_by` = `created_by`.`id` and `cat`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`cat`.`updated_by` = `updated_by`.`id` and `cat`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_category_3`
--

/*!50001 DROP VIEW IF EXISTS `v_product_category_3`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_category_3` AS select `cat`.`id` AS `id`,`cat`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`cat`.`product_category_3` AS `product_category_3`,`cat`.`del_flg` AS `del_flg`,`cat`.`created_at` AS `created_at`,`cat`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_product_category_3` `cat` join `tb_inventory_category` `inv_cat` on(`cat`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`cat`.`created_by` = `created_by`.`id` and `cat`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`cat`.`updated_by` = `updated_by`.`id` and `cat`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_kamoku_category`
--

/*!50001 DROP VIEW IF EXISTS `v_product_kamoku_category`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_kamoku_category` AS select `cat`.`id` AS `id`,`cat`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`cat`.`product_kamoku_category` AS `product_kamoku_category`,`cat`.`del_flg` AS `del_flg`,`cat`.`created_at` AS `created_at`,`cat`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_product_kamoku_category` `cat` join `tb_inventory_category` `inv_cat` on(`cat`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`cat`.`created_by` = `created_by`.`id` and `cat`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`cat`.`updated_by` = `updated_by`.`id` and `cat`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_master_hist`
--

/*!50001 DROP VIEW IF EXISTS `v_product_master_hist`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_master_hist` AS select `product`.`id` AS `id`,`product`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`unit` AS `unit`,`product`.`contents` AS `contents`,`product`.`ratio` AS `ratio`,`product`.`remarks` AS `remarks`,`product`.`tax_par` AS `tax_par`,`product`.`product_kamoku_category_id` AS `product_kamoku_category_id`,`kamoku`.`product_kamoku_category` AS `product_kamoku_category`,`product`.`product_category_1_id` AS `product_category_1_id`,`cat1`.`product_category_1` AS `product_category_1`,`product`.`product_category_2_id` AS `product_category_2_id`,`cat2`.`product_category_2` AS `product_category_2`,`product`.`product_category_3_id` AS `product_category_3_id`,`cat3`.`product_category_3` AS `product_category_3`,`product_now`.`product_id` AS `product_id_now`,`product`.`del_flg` AS `del_flg`,`product`.`created_at` AS `created_at`,`product`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((((((((`tb_product_master_hist` `product` join `tb_inventory_category` `inv_cat` on(`product`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `product`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `product`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `cat1` on(`product`.`product_category_1_id` = `cat1`.`id` and `product`.`inventory_category_id` = `cat1`.`inventory_category_id`)) left join `tb_product_category_2` `cat2` on(`product`.`product_category_2_id` = `cat2`.`id` and `product`.`inventory_category_id` = `cat2`.`inventory_category_id`)) left join `tb_product_category_3` `cat3` on(`product`.`product_category_3_id` = `cat3`.`id` and `product`.`inventory_category_id` = `cat3`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`product`.`created_by` = `created_by`.`id` and `product`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_product_master_now` `product_now` on(`product`.`product_code` = `product_now`.`product_code` and `product`.`inventory_category_id` = `product_now`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`product`.`updated_by` = `updated_by`.`id` and `product`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_product_master_now`
--

/*!50001 DROP VIEW IF EXISTS `v_product_master_now`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_product_master_now` AS select `product_now`.`product_id` AS `id`,`product`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product_now`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`unit` AS `unit`,`product`.`contents` AS `contents`,`product`.`ratio` AS `ratio`,`product`.`remarks` AS `remarks`,`product`.`tax_par` AS `tax_par`,`product`.`product_kamoku_category_id` AS `product_kamoku_category_id`,`kamoku`.`product_kamoku_category` AS `product_kamoku_category`,`product`.`product_category_1_id` AS `product_category_1_id`,`cat1`.`product_category_1` AS `product_category_1`,`product`.`product_category_2_id` AS `product_category_2_id`,`cat2`.`product_category_2` AS `product_category_2`,`product`.`product_category_3_id` AS `product_category_3_id`,`cat3`.`product_category_3` AS `product_category_3`,`product`.`del_flg` AS `del_flg`,`product_now`.`created_at` AS `created_at`,`product_now`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((((((((`tb_product_master_now` `product_now` join `tb_product_master_hist` `product` on(`product_now`.`product_code` = `product`.`product_code` and `product`.`id` = `product_now`.`product_id` and `product_now`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_inventory_category` `inv_cat` on(`product`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `product`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `product`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `cat1` on(`product`.`product_category_1_id` = `cat1`.`id` and `product`.`inventory_category_id` = `cat1`.`inventory_category_id`)) left join `tb_product_category_2` `cat2` on(`product`.`product_category_2_id` = `cat2`.`id` and `product`.`inventory_category_id` = `cat2`.`inventory_category_id`)) left join `tb_product_category_3` `cat3` on(`product`.`product_category_3_id` = `cat3`.`id` and `product`.`inventory_category_id` = `cat3`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`product`.`created_by` = `created_by`.`id` and `product`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`product`.`updated_by` = `updated_by`.`id` and `product`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_report_hist_product`
--

/*!50001 DROP VIEW IF EXISTS `v_report_hist_product`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_report_hist_product` AS select `tables`.`id` AS `id`,`tables`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`tables`.`order_id` AS `order_id`,`tables`.`report_date` AS `report_date`,`tables`.`category_name` AS `category_name`,`tables`.`product_id` AS `product_id`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`unit` AS `unit`,`product`.`tax_par` AS `tax_par`,`product`.`product_kamoku_category_id` AS `product_kamoku_category_id`,`kamoku`.`product_kamoku_category` AS `product_kamoku_category`,`product`.`product_category_1_id` AS `product_category_1_id`,`prd_cat1`.`product_category_1` AS `product_category_1`,`product`.`product_category_2_id` AS `product_category_2_id`,`prd_cat2`.`product_category_2` AS `product_category_2`,`product`.`product_category_3_id` AS `product_category_3_id`,`prd_cat3`.`product_category_3` AS `product_category_3`,`tables`.`order_check_price_unit` AS `order_check_price_unit`,`tables`.`stock_cnt` AS `stock_cnt`,`tables`.`use_cnt` AS `use_cnt`,ifnull(`tables`.`stock_cnt` - `tables`.`use_cnt`,0) AS `calc_cnt`,case when `tables`.`category_name` = '仕入' then `tables`.`order_price` when `tables`.`category_name` = '使用' then ifnull(`tables`.`stock_cnt` - `tables`.`use_cnt`,0) * `tables`.`order_check_price_unit` else 0 end AS `stock_price`,`tables`.`order_product_status_id` AS `order_product_status_id`,`order_sts`.`order_product_status` AS `order_product_status`,`order_sts`.`phase` AS `phase`,`tables`.`created_at` AS `created_at`,`tables`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((((((((((select concat('増加_',`orders`.`id`) AS `id`,'仕入' AS `category_name`,`orders`.`id` AS `order_id`,`orders`.`inventory_category_id` AS `inventory_category_id`,`orders`.`product_id` AS `product_id`,`orders`.`order_price` AS `order_price`,`orders`.`order_price` / `orders`.`order_check_cnt_unit` AS `order_check_price_unit`,`orders`.`deliver_date` AS `report_date`,`orders`.`order_check_cnt_unit` AS `stock_cnt`,0 AS `use_cnt`,`orders`.`order_product_status_id` AS `order_product_status_id`,`orders`.`created_at` AS `created_at`,`orders`.`updated_at` AS `updated_at`,`orders`.`created_by` AS `created_by`,`orders`.`updated_by` AS `updated_by` from `tb_order_product` `orders` union all select concat('減少_',`day_rep`.`id`) AS `id`,'使用' AS `category_name`,`orders`.`id` AS `order_id`,`day_rep`.`inventory_category_id` AS `inventory_category_id`,`orders`.`product_id` AS `product_id`,`orders`.`order_price` AS `order_price`,`orders`.`order_price` / `orders`.`order_check_cnt_unit` AS `order_check_price_unit`,`day_rep`.`report_date` AS `report_date`,0 AS `stock_cnt`,`day_rep`.`use_cnt` AS `use_cnt`,`orders`.`order_product_status_id` AS `order_product_status_id`,`day_rep`.`created_at` AS `created_at`,`day_rep`.`updated_at` AS `updated_at`,`day_rep`.`created_by` AS `created_by`,`day_rep`.`updated_by` AS `updated_by` from (`tb_day_report_product` `day_rep` join `tb_order_product` `orders` on(`orders`.`id` = `day_rep`.`order_product_id`))) `tables` join `tb_inventory_category` `inv_cat` on(`tables`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_product_master_hist` `product` on(`tables`.`product_id` = `product`.`id` and `tables`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `tables`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `tables`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `prd_cat1` on(`product`.`product_category_1_id` = `prd_cat1`.`id` and `tables`.`inventory_category_id` = `prd_cat1`.`inventory_category_id`)) left join `tb_product_category_2` `prd_cat2` on(`product`.`product_category_2_id` = `prd_cat2`.`id` and `tables`.`inventory_category_id` = `prd_cat2`.`inventory_category_id`)) left join `tb_product_category_3` `prd_cat3` on(`product`.`product_category_3_id` = `prd_cat3`.`id` and `tables`.`inventory_category_id` = `prd_cat3`.`inventory_category_id`)) join `tb_order_product_status` `order_sts` on(`tables`.`order_product_status_id` = `order_sts`.`id` and `tables`.`inventory_category_id` = `order_sts`.`inventory_category_id`)) join `tb_user_master` `created_by` on(`tables`.`created_by` = `created_by`.`id`)) join `tb_user_master` `updated_by` on(`tables`.`updated_by` = `updated_by`.`id`)) group by `tables`.`id` order by `tables`.`report_date` desc,`tables`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_report_stock_product`
--

/*!50001 DROP VIEW IF EXISTS `v_report_stock_product`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_report_stock_product` AS select `tables`.`order_id` AS `id`,`tables`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`tables`.`order_check_date` AS `order_check_date`,`tables`.`deliver_date` AS `deliver_date`,`tables`.`product_id` AS `product_id`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`unit` AS `unit`,`product`.`tax_par` AS `tax_par`,`product`.`product_kamoku_category_id` AS `product_kamoku_category_id`,`kamoku`.`product_kamoku_category` AS `product_kamoku_category`,`product`.`product_category_1_id` AS `product_category_1_id`,`prd_cat1`.`product_category_1` AS `product_category_1`,`product`.`product_category_2_id` AS `product_category_2_id`,`prd_cat2`.`product_category_2` AS `product_category_2`,`product`.`product_category_3_id` AS `product_category_3_id`,`prd_cat3`.`product_category_3` AS `product_category_3`,`tables`.`order_product_status_id` AS `order_product_status_id`,`order_sts`.`order_product_status` AS `order_product_status`,`order_sts`.`phase` AS `phase`,sum(`tables`.`order_price`) AS `order_price`,sum(`tables`.`stock_cnt`) AS `order_check_cnt_unit`,`tables`.`order_check_price_unit` AS `order_check_price_unit`,sum(`tables`.`use_cnt`) AS `use_cnt`,ifnull(sum(`tables`.`stock_cnt`) - sum(`tables`.`use_cnt`),0) AS `stock_cnt`,sum(case when `tables`.`category_name` = '仕入' then `tables`.`order_price` when `tables`.`category_name` = '使用' then ifnull(`tables`.`stock_cnt` - `tables`.`use_cnt`,0) * `tables`.`order_check_price_unit` else 0 end) AS `stock_price`,max(`tables`.`created_at`) AS `created_at`,max(`tables`.`updated_at`) AS `updated_at` from (((((((((select `orders`.`id` AS `order_id`,'仕入' AS `category_name`,`orders`.`inventory_category_id` AS `inventory_category_id`,`orders`.`product_id` AS `product_id`,`orders`.`order_price` AS `order_price`,`orders`.`order_price` / `orders`.`order_check_cnt_unit` AS `order_check_price_unit`,`orders`.`order_check_date` AS `order_check_date`,`orders`.`deliver_date` AS `deliver_date`,`orders`.`order_check_cnt_unit` AS `stock_cnt`,0 AS `use_cnt`,`orders`.`order_product_status_id` AS `order_product_status_id`,`orders`.`created_at` AS `created_at`,`orders`.`updated_at` AS `updated_at` from `tb_order_product` `orders` union all select `orders`.`id` AS `order_id`,'使用' AS `category_name`,`day_rep`.`inventory_category_id` AS `inventory_category_id`,`orders`.`product_id` AS `product_id`,0 AS `order_price`,`orders`.`order_price` / `orders`.`order_check_cnt_unit` AS `order_check_price_unit`,`orders`.`order_check_date` AS `order_check_date`,`orders`.`deliver_date` AS `deliver_date`,0 AS `stock_cnt`,`day_rep`.`use_cnt` AS `use_cnt`,`orders`.`order_product_status_id` AS `order_product_status_id`,`day_rep`.`created_at` AS `created_at`,`day_rep`.`updated_at` AS `updated_at` from (`tb_day_report_product` `day_rep` join `tb_order_product` `orders` on(`orders`.`id` = `day_rep`.`order_product_id`))) `tables` join `tb_inventory_category` `inv_cat` on(`tables`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_product_master_hist` `product` on(`tables`.`product_id` = `product`.`id` and `tables`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `tables`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `tables`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `prd_cat1` on(`product`.`product_category_1_id` = `prd_cat1`.`id` and `tables`.`inventory_category_id` = `prd_cat1`.`inventory_category_id`)) left join `tb_product_category_2` `prd_cat2` on(`product`.`product_category_2_id` = `prd_cat2`.`id` and `tables`.`inventory_category_id` = `prd_cat2`.`inventory_category_id`)) left join `tb_product_category_3` `prd_cat3` on(`product`.`product_category_3_id` = `prd_cat3`.`id` and `tables`.`inventory_category_id` = `prd_cat3`.`inventory_category_id`)) join `tb_order_product_status` `order_sts` on(`tables`.`order_product_status_id` = `order_sts`.`id` and `tables`.`inventory_category_id` = `order_sts`.`inventory_category_id`)) group by `tables`.`order_id` order by `product`.`product_code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_report_stock_product_group`
--

/*!50001 DROP VIEW IF EXISTS `v_report_stock_product_group`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_report_stock_product_group` AS select group_concat(distinct `tables`.`order_id` separator ',') AS `ids`,`tables`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,group_concat(distinct `tables`.`product_id` separator ',') AS `product_ids`,`product`.`product_code` AS `product_code`,`product`.`product_name` AS `product_name`,`product`.`supplier_id` AS `supplier_id`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`supplier_name` AS `supplier_name`,`product`.`unit` AS `unit`,`product`.`tax_par` AS `tax_par`,group_concat(distinct `kamoku`.`product_kamoku_category` separator ',') AS `product_kamoku_category`,group_concat(distinct `prd_cat1`.`product_category_1` separator ',') AS `product_category_1`,group_concat(distinct `prd_cat2`.`product_category_2` separator ',') AS `product_category_2`,group_concat(distinct `prd_cat3`.`product_category_3` separator ',') AS `product_category_3`,`tables`.`order_product_status_id` AS `order_product_status_id`,`order_sts`.`order_product_status` AS `order_product_status`,`order_sts`.`phase` AS `phase`,sum(`tables`.`order_price`) AS `order_price`,sum(`tables`.`stock_cnt`) AS `order_check_cnt_unit`,sum(`tables`.`order_price`) / sum(`tables`.`stock_cnt`) AS `order_check_price_unit`,sum(`tables`.`use_cnt`) AS `use_cnt`,ifnull(sum(`tables`.`stock_cnt`) - sum(`tables`.`use_cnt`),0) AS `stock_cnt`,sum(case when `tables`.`category_name` = '仕入' then `tables`.`order_price` when `tables`.`category_name` = '使用' then ifnull(`tables`.`stock_cnt` - `tables`.`use_cnt`,0) * `tables`.`order_check_price_unit` else 0 end) AS `stock_price`,max(`tables`.`created_at`) AS `created_at`,max(`tables`.`updated_at`) AS `updated_at` from (((((((((select `orders`.`id` AS `order_id`,'仕入' AS `category_name`,`orders`.`inventory_category_id` AS `inventory_category_id`,`orders`.`product_id` AS `product_id`,`orders`.`order_price` AS `order_price`,`orders`.`order_price` / `orders`.`order_check_cnt_unit` AS `order_check_price_unit`,`orders`.`order_check_cnt_unit` AS `stock_cnt`,0 AS `use_cnt`,`orders`.`order_product_status_id` AS `order_product_status_id`,`orders`.`created_at` AS `created_at`,`orders`.`updated_at` AS `updated_at` from `tb_order_product` `orders` union all select `orders`.`id` AS `order_id`,'使用' AS `category_name`,`day_rep`.`inventory_category_id` AS `inventory_category_id`,`orders`.`product_id` AS `product_id`,0 AS `order_price`,`orders`.`order_price` / `orders`.`order_check_cnt_unit` AS `order_check_price_unit`,0 AS `stock_cnt`,`day_rep`.`use_cnt` AS `use_cnt`,`orders`.`order_product_status_id` AS `order_product_status_id`,`day_rep`.`created_at` AS `created_at`,`day_rep`.`updated_at` AS `updated_at` from (`tb_day_report_product` `day_rep` join `tb_order_product` `orders` on(`orders`.`id` = `day_rep`.`order_product_id`))) `tables` join `tb_inventory_category` `inv_cat` on(`tables`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_product_master_hist` `product` on(`tables`.`product_id` = `product`.`id` and `tables`.`inventory_category_id` = `product`.`inventory_category_id`)) join `tb_supplier_master` `supplier` on(`product`.`supplier_id` = `supplier`.`id` and `tables`.`inventory_category_id` = `supplier`.`inventory_category_id`)) left join `tb_product_kamoku_category` `kamoku` on(`product`.`product_kamoku_category_id` = `kamoku`.`id` and `tables`.`inventory_category_id` = `kamoku`.`inventory_category_id`)) left join `tb_product_category_1` `prd_cat1` on(`product`.`product_category_1_id` = `prd_cat1`.`id` and `tables`.`inventory_category_id` = `prd_cat1`.`inventory_category_id`)) left join `tb_product_category_2` `prd_cat2` on(`product`.`product_category_2_id` = `prd_cat2`.`id` and `tables`.`inventory_category_id` = `prd_cat2`.`inventory_category_id`)) left join `tb_product_category_3` `prd_cat3` on(`product`.`product_category_3_id` = `prd_cat3`.`id` and `tables`.`inventory_category_id` = `prd_cat3`.`inventory_category_id`)) join `tb_order_product_status` `order_sts` on(`tables`.`order_product_status_id` = `order_sts`.`id` and `tables`.`inventory_category_id` = `order_sts`.`inventory_category_id`)) group by `tables`.`inventory_category_id`,`product`.`product_code`,`product`.`unit`,`product`.`tax_par`,`supplier`.`supplier_code`,`tables`.`order_product_status_id` order by `product`.`product_code` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_supplier_master`
--

/*!50001 DROP VIEW IF EXISTS `v_supplier_master`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_supplier_master` AS select `supplier`.`id` AS `id`,`supplier`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`supplier`.`supplier_code` AS `supplier_code`,`supplier`.`corporation_code` AS `corporation_code`,`supplier`.`Invoice_code` AS `Invoice_code`,`supplier`.`supplier_name` AS `supplier_name`,`supplier`.`remarks` AS `remarks`,`supplier`.`del_flg` AS `del_flg`,`supplier`.`created_at` AS `created_at`,`supplier`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_supplier_master` `supplier` join `tb_inventory_category` `inv_cat` on(`supplier`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`supplier`.`created_by` = `created_by`.`id` and `supplier`.`inventory_category_id` = `created_by`.`inventory_category_id`)) join `tb_user_master` `updated_by` on(`supplier`.`updated_by` = `updated_by`.`id` and `supplier`.`inventory_category_id` = `updated_by`.`inventory_category_id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_user_master`
--

/*!50001 DROP VIEW IF EXISTS `v_user_master`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `v_user_master` AS select `user`.`id` AS `id`,`user`.`inventory_category_id` AS `inventory_category_id`,`inv_cat`.`inventory_category` AS `inventory_category`,`inv_cat`.`inventory_category_path` AS `inventory_category_path`,`user`.`user_name` AS `user_name`,`user`.`email` AS `email`,`user`.`priority` AS `priority`,`user`.`disable_flg` AS `disable_flg`,`user`.`del_flg` AS `del_flg`,`user`.`created_at` AS `created_at`,`user`.`updated_at` AS `updated_at`,`created_by`.`user_name` AS `created_by`,`updated_by`.`user_name` AS `updated_by` from (((`tb_user_master` `user` join `tb_inventory_category` `inv_cat` on(`user`.`inventory_category_id` = `inv_cat`.`id`)) join `tb_user_master` `created_by` on(`user`.`created_by` = `created_by`.`id`)) join `tb_user_master` `updated_by` on(`user`.`updated_by` = `updated_by`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-18 15:16:15
