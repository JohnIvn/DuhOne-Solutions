CREATE TABLE useraccounts2 (
    userId int AUTO_INCREMENT PRIMARY KEY,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
