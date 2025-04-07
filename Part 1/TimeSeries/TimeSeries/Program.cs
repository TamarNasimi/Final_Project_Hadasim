
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

class Program
{
    public static void Main()
    {
        string inputFilePath = "time_series.csv";  // קובץ נתונים מקוריים
        string outputFilePath = "hourly_averages.csv";   // קובץ תוצאה עם ממוצעים לפי שעה

        // קריאת הנתונים מהקובץ
        List<(DateTime timestamp, double value)> data = ReadCsvData(inputFilePath);

        if (data.Count == 0)
        {
            Console.WriteLine("No valid data in the file.");
            return;
        }

        // חישוב הממוצע עבור כל שעה
        Dictionary<DateTime, double> hourlyAverages = CalculateHourlyAverages(data);

        // הצגת הנתונים
        PrintResults(hourlyAverages);

        // שמירת הנתונים לקובץ חדש
        WriteCsvData(outputFilePath, hourlyAverages);

        Console.WriteLine($"The data savein the file: {outputFilePath}");
    }

    // פונקציה הקוראת נתונים מקובץ CSV
    public static List<(DateTime, double)> ReadCsvData(string filePath)
    {
        List<(DateTime, double)> data = new List<(DateTime, double)>();

        try
        {
            using (StreamReader reader = new StreamReader(filePath))
            {
                string headerLine = reader.ReadLine(); // קריאת כותרת הקובץ

                if (string.IsNullOrEmpty(headerLine))
                    return data;

                string line;
                while ((line = reader.ReadLine()) != null) //לולאה שעוברת על הקובץ
                {
                    string[] parts = line.Split(','); //מחלקת את השורה לחלק של הזמן ולחלק של הערך

                    if (parts.Length != 2)
                        continue;
                    // ניסיון להמיר את חותמת הזמן
                    if (!DateTime.TryParse(parts[0].Trim(), out DateTime timestamp))
                        continue;

                    if (!double.TryParse(parts[1].Trim(), out double value))
                        continue;
                   

                    data.Add((timestamp, value)); //הוספת השורה לרשימת הנתונים
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error reading file: {ex.Message}");
        }

        return data;
    }


    // פונקציה לחישוב ממוצע הנתונים עבור כל שעה שלמה

    public static Dictionary<DateTime, double> CalculateHourlyAverages(List<(DateTime timestamp, double value)> data)
    {
        Dictionary<DateTime, List<double>> hourlyData = new Dictionary<DateTime, List<double>>();

        foreach (var value in data)
        {
            DateTime hourKey = new DateTime(value.timestamp.Year, value.timestamp.Month, value.timestamp.Day, value.timestamp.Hour, 0, 0);

            if (!hourlyData.ContainsKey(hourKey))
                hourlyData[hourKey] = new List<double>();

            // מוסיפים לרשימה רק ערכים חוקיים
            if (!double.IsNaN(value.value))
                hourlyData[hourKey].Add(value.value);
        }

        // חישוב ממוצע רק על ערכים חוקיים בכל שעה
        return hourlyData
            .Where(value => value.Value.Count > 0) // בדיקה שלא מחשבים ממוצע לרשימה ריקה
            .ToDictionary(key => key.Key, value => value.Value.Average());
    }



    // פונקציה המציגה את התוצאות בטבלה בפורמט הרצוי
    public static void PrintResults(Dictionary<DateTime, double> hourlyAverages)
    {
        Console.WriteLine("|    Start time       |Average|");
        Console.WriteLine("|---------------------|------|");

        foreach (var value in hourlyAverages.OrderBy(v => v.Key))
        {
            Console.WriteLine($"| {value.Key:yyyy-MM-dd HH:mm:ss} | {value.Value} |");
        }
    }

    /// פונקציה הכותבת את הנתונים לקובץ CSV חדש
    static void WriteCsvData(string filePath, Dictionary<DateTime, double> hourlyAverages)
    {
        try
        {
            using (StreamWriter writer = new StreamWriter(filePath))
            {
                writer.WriteLine("זמן התחלה,ממוצע");

                foreach (var value in hourlyAverages.OrderBy(v => v.Key))
                {
                    writer.WriteLine($"{value.Key:yyyy-MM-dd HH:mm:ss},{value.Value}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"שגיאה בכתיבת הקובץ: {ex.Message}");
        }
    }
}
