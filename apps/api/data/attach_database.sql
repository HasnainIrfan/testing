-- Attach your database
-- CREATE DATABASE ISL_REV_07 
-- ON (FILENAME = 'C:\temp\Databases\SQL_DATABASE.mdf')
-- FOR ATTACH;
SELECT SERVERPROPERTY('InstanceDefaultDataPath') AS DefaultDataPat



CREATE DATABASE ISL_REV_07 
ON (FILENAME = 'C:\Program Files (x86)\Microsoft SQL Server\SQL_DATABASE.mdf')
FOR ATTACH;

SELECT @@VERSION;


SELECT 
    @@SERVERNAME AS ServerName,
    @@VERSION AS Version,
    SERVERPROPERTY('ProductVersion') AS ProductVersion,
    SERVERPROPERTY('InstanceName') AS InstanceName;


RESTORE DATABASE ISL_REV_07 
FROM DISK = 'C:\Program Files\Microsoft SQL Server\ISL REV 07_SQL_DATABASE.bak'
WITH REPLACE;