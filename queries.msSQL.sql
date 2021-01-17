CREATE TABLE userInfo
(
    id       INT                NOT NULL PRIMARY KEY IDENTITY(1,1),
    login    VARCHAR(50) UNIQUE NOT NULL,
    name     VARCHAR(100)       NOT NULL,
    password VARCHAR(100)       NOT NULL,
    gender   VARCHAR(1)         NOT NULL,
    birthday DATE               NOT NULL,
    status   SMALLINT DEFAULT 1
);

CREATE TABLE user_contacts
(
    id          INT          NOT NULL PRIMARY KEY IDENTITY(1,1),
    userId      INT          NOT NULL,
    description VARCHAR(50)  NOT NULL,
    data        VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_user_contact
        FOREIGN KEY (userId)
            REFERENCES userInfo (id)
);

CREATE TABLE currency
(
    id           INT        NOT NULL PRIMARY KEY IDENTITY(1, 1),
    currencyName VARCHAR(5) NOT NULL
);

CREATE TABLE user_wallets
(
    id           INT PRIMARY KEY IDENTITY(1,1),
    userId       INT NOT NULL,
    userBalance  DECIMAL(15,2) NOT NULL,
    currencyId   INT NOT NULL,
    walletStatus SMALLINT DEFAULT 0,
    CONSTRAINT fk_user_wallets
        FOREIGN KEY (userId)
            REFERENCES userInfo (id),
    CONSTRAINT fk_currency_wallet
        FOREIGN KEY (currencyId)
            REFERENCES currency (id),
    CONSTRAINT user_currency UNIQUE (userId, currencyId)
);

INSERT INTO userInfo (login, name, password, gender, birthday, status)
VALUES ('convallis', 'Simeon', '96cb588540acaa87ebdb7e92a5088ff3639c7e8271f52b2c76714505c05594c9', 'm',
        '2000-01-19', 1),
       ('ultrices', 'Chandra', '60a854f5e65e884a692375b38a2aa4a2ce6da662c503a54aeed57c19cbf90b14', 'f',
        '1999-03-15', 1),
       ('rutrum', 'Sal', '19ebb8c61c5519a65405fad329346136d0d2b8def2bab2a6cbcea1ad2a4ee31f', 'm', '1985-05-11', 1);

INSERT INTO user_contacts (userId, description, data)
VALUES (1, 'email', 'mwhines0@ebay.co.uk'),
       (1, 'email', 'pbrookfield3@dmoz.org'),
       (1, 'address', '1 Weeping Birch Park'),
       (1, 'phone', '307-593-9706'),
       (2, 'email', 'bhaslum6@xinhuanet.com'),
       (2, 'address', '9 Hollow Ridge Hill'),
       (2, 'phone', '949-868-4212'),
       (2, 'phone', '109-853-7392'),
       (3, 'address', '94815 Bayside Junction'),
       (3, 'email', 'gstrippelf@jiathis.com'),
       (3, 'phone', '937-935-8477');

INSERT INTO currency(currencyName)
VALUES ('EUR'),
       ('RUB'),
       ('USD'),
       ('CZK'),
       ('RMB');

INSERT INTO user_wallets (userId, currencyId, userBalance, walletStatus)
VALUES (1, 1, 500, 1),
       (1, 2, 100, 0),
       (2, 3, 134, 0),
       (2, 4, 480, 1),
       (3, 1, 365, 1);


#--------------------------------- Queries -------------------------
# show the user with his active wallet and balance
SELECT u.id, u.name, uw.userBalance, c.currencyName, uw.walletStatus
FROM user_wallets as uw
         LEFT JOIN currency c on c.id = uw.currencyId
         LEFT JOIN userInfo u on u.id = uw.userId
WHERE uw.walletStatus LIKE 1;

# update wallet +
UPDATE user_wallets
SET userBalance = userBalance + ' . $betAmout . '
WHERE userId = ' . $userId .' and walletStatus = 1;


# update wallet -
UPDATE user_wallets
SET userBalance = userBalance - ' . $betAmout . '
WHERE userId = ' . $userId .' and walletStatus = 1;