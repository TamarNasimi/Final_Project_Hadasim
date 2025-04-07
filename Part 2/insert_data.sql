

-- שלב 1: הכנס קודם את כל האנשים בלי Spouse_Id בכלל
INSERT INTO Person (Person_Id, First_Name, Last_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES
(1, 'David',   'Levi',     'male',   NULL, NULL, NULL),
(2, 'Rachel',  'Levi',     'female', NULL, NULL, NULL),
(3, 'Eli',     'Levi',     'male',   1, 2, NULL),
(4, 'Noa',     'Levi',     'female', 1, 2, NULL),
(5, 'Tamar',   'Levi',     'female', 1, 2, NULL),
(6, 'Avi',     'Cohen',    'male',   NULL, NULL, NULL),
(7, 'Dana',    'Cohen',    'female', NULL, NULL, NULL),
(8, 'Yonatan', 'Cohen',    'male',   6, 7, NULL),
(9, 'Roni',    'Cohen',    'female', 6, 7, NULL),
(10, 'Maya',   'Shalev',   'female', NULL, NULL, NULL);


-- שלב 2: עדכון בני הזוג
UPDATE Person SET Spouse_Id = 2 WHERE Person_Id = 1;  -- דוד -> רחל
UPDATE Person SET Spouse_Id = 6 WHERE Person_Id = 7;  -- דנה -> אבי






