-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 11, 2022 at 09:15 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nwvoc-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `nwvoc_post`
--

CREATE TABLE `nwvoc_post` (
  `post_id` int(11) NOT NULL,
  `post_by` varchar(60) NOT NULL,
  `post_topic` varchar(60) NOT NULL,
  `post_content` mediumtext NOT NULL,
  `post_time` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `nwvoc_ranks`
--

CREATE TABLE `nwvoc_ranks` (
  `ranks_id` int(11) NOT NULL,
  `ranks_name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `nwvoc_user`
--

CREATE TABLE `nwvoc_user` (
  `user_id` int(11) NOT NULL,
  `user_firstname` varchar(120) NOT NULL,
  `user_lastname` varchar(120) NOT NULL,
  `user_email` varchar(60) NOT NULL,
  `user_pass` varchar(120) NOT NULL,
  `user_rank` int(11) NOT NULL,
  `user_postion` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `nwvoc_post`
--
ALTER TABLE `nwvoc_post`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `nwvoc_ranks`
--
ALTER TABLE `nwvoc_ranks`
  ADD PRIMARY KEY (`ranks_id`);

--
-- Indexes for table `nwvoc_user`
--
ALTER TABLE `nwvoc_user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nwvoc_post`
--
ALTER TABLE `nwvoc_post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nwvoc_ranks`
--
ALTER TABLE `nwvoc_ranks`
  MODIFY `ranks_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nwvoc_user`
--
ALTER TABLE `nwvoc_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
