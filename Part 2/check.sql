
SELECT * FROM Relatives ORDER BY Person_Id, Connection_Type;


SELECT
  r.Person_Id,
  p1.First_Name AS Person_Name,
  r.Relative_Id,
  p2.First_Name AS Relative_Name,
  r.Connection_Type
FROM Relatives r
JOIN Person p1 ON r.Person_Id = p1.Person_Id
JOIN Person p2 ON r.Relative_Id = p2.Person_Id
ORDER BY r.Person_Id, r.Connection_Type;


SELECT *
FROM Person p1
JOIN Person p2 ON p1.Spouse_Id = p2.Person_Id
WHERE p2.Spouse_Id <> p1.Person_Id;
