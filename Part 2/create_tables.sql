CREATE TABLE Person (
    Person_Id INT PRIMARY KEY,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Gender ENUM('male', 'female'),
    Father_Id INT,
    Mother_Id INT,
    Spouse_Id INT,
    FOREIGN KEY (Father_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY (Mother_Id) REFERENCES Person(Person_Id),
	FOREIGN KEY (Spouse_Id) REFERENCES Person(Person_Id)
);

CREATE TABLE Relatives (
    Person_Id INT,person
    Relative_Id INT,
    Connection_Type ENUM('father', 'mother', 'brother', 'sister', 'son', 'daughter', 'spouse'),
	PRIMARY KEY (Person_Id, Relative_Id),
    FOREIGN KEY (Person_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES Person(Person_Id)
);
