UPDATE Person p1
JOIN Person p2 ON p1.Spouse_Id = p2.Person_Id
SET p2.Spouse_Id = p1.Person_Id
WHERE p2.Spouse_Id IS NULL;


INSERT INTO Relatives (Person_Id, Relative_Id, Connection_Type)
SELECT p2.Person_Id, p1.Person_Id, 'spouse'
FROM Person p1
JOIN Person p2 ON p1.Spouse_Id = p2.Person_Id
WHERE NOT EXISTS (
    SELECT 1 FROM Relatives r
    WHERE r.Person_Id = p2.Person_Id AND r.Relative_Id = p1.Person_Id AND r.Connection_Type = 'spouse'
);
