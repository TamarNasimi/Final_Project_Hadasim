-- הוספת אב
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Father_Id, 'father'
FROM Person
WHERE Father_Id IS NOT NULL;

-- הוספת אם
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Mother_Id, 'mother'
FROM Person
WHERE Mother_Id IS NOT NULL;

-- ילדים מהצד של האבא
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Father_Id, Person_Id,
       CASE WHEN Gender = 'male' THEN 'son' ELSE 'daughter' END
FROM Person
WHERE Father_Id IS NOT NULL;

-- ילדים מהצד של האמא
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Mother_Id, Person_Id,
       CASE WHEN Gender = 'male' THEN 'son' ELSE 'daughter' END
FROM Person
WHERE Mother_Id IS NOT NULL;

-- הוספת בני זוג
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT Person_Id, Spouse_Id, 'spouse'
FROM Person
WHERE Spouse_Id IS NOT NULL;

-- הוספת אחים ואחיות
INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id, p2.Person_Id,
       CASE WHEN p2.Gender = 'male' THEN 'brother' ELSE 'sister' END
FROM Person p1
JOIN Person p2
  ON p1.Person_Id <> p2.Person_Id
 AND (
       (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id)
    OR (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
    )
WHERE NOT EXISTS (
    SELECT 1 FROM Relatives r
    WHERE r.Person_Id = p1.Person_Id AND r.Relative_Id = p2.Person_Id
);
