/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100416 (10.4.16-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : criteria_expert

 Target Server Type    : MySQL
 Target Server Version : 100416 (10.4.16-MariaDB)
 File Encoding         : 65001

 Date: 27/04/2023 01:21:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `q_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `link` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `status` enum('0','1','2','3') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '0: none, 1: yes, 2: maybe, 3: no',
  `created_at` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Function structure for levenshtein
-- ----------------------------
DROP FUNCTION IF EXISTS `levenshtein`;
delimiter ;;
CREATE FUNCTION `levenshtein`(s1 VARCHAR(255), s2 VARCHAR(255))
 RETURNS int(11)
  DETERMINISTIC
BEGIN
  DECLARE s1_len, s2_len, i, j, c, c_temp, cost INT;
  DECLARE s1_char CHAR;
  DECLARE cv0, cv1 VARBINARY(256);
  
  SET s1_len = CHAR_LENGTH(s1), s2_len = CHAR_LENGTH(s2), cv1 = 0x00, j = 1, i = 1, c = 0;
  
  IF s1 = s2 THEN
    RETURN 0;
  ELSEIF s1_len = 0 THEN
    RETURN s2_len;
  ELSEIF s2_len = 0 THEN
    RETURN s1_len;
  ELSE
    WHILE j <= s2_len DO
      SET cv1 = CONCAT(cv1, UNHEX(HEX(j))), j = j + 1;
    END WHILE;
    
    WHILE i <= s1_len DO
      SET s1_char = SUBSTRING(s1, i, 1), c = i, cv0 = UNHEX(HEX(i)), j = 1;
      
      WHILE j <= s2_len DO
        SET c = c + 1;
        
        IF s1_char = SUBSTRING(s2, j, 1) THEN
          SET cost = 0;
        ELSE
          SET cost = 1;
        END IF;
        
        SET c_temp = CONV(HEX(SUBSTRING(cv1, j, 1)), 16, 10) + cost;
        
        IF c > c_temp THEN
          SET c = c_temp;
        END IF;
        
        SET c_temp = CONV(HEX(SUBSTRING(cv1, j+1, 1)), 16, 10) + 1;
        
        IF c > c_temp THEN
          SET c = c_temp;
        END IF;
        
        SET cv0 = CONCAT(cv0, UNHEX(HEX(c))), j = j + 1;
      END WHILE;
      
      SET cv1 = cv0, i = i + 1;
    END WHILE;
  END IF;
  
  RETURN c;
END
;;
delimiter ;

-- ----------------------------
-- Function structure for levenshtein_ratio
-- ----------------------------
DROP FUNCTION IF EXISTS `levenshtein_ratio`;
delimiter ;;
CREATE FUNCTION `levenshtein_ratio`(s1 VARCHAR(255), s2 VARCHAR(255))
 RETURNS float
  DETERMINISTIC
BEGIN
  DECLARE distance, max_len INT;
  
  SET distance = levenshtein(s1, s2);
  SET max_len = GREATEST(CHAR_LENGTH(s1), CHAR_LENGTH(s2));
  
  IF max_len = 0 THEN
    RETURN 0;
  ELSE
    RETURN (1 - distance / max_len);
  END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
