using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

class Program
{
    public static void Main()
    {
        string inputFilePath = "time_series.csv";
        string outputDirectory = "daily_parts";
        string finalOutputFile = "hourly_averages.csv";

        // פונקציה המחלקת את הנתונים לפי ימים
        SplitFileByDay(inputFilePath, outputDirectory);

        // חישוב ממוצע שעתי לכל קובץ
        List<(DateTime Hour, double Average)> allHourlyAverages = new List<(DateTime, double)>();
        foreach (string filePath in Directory.GetFiles(outputDirectory, "*.csv"))
        {
            var hourAverages = CalculateHourAverages(filePath); 
            allHourlyAverages.AddRange(hourAverages); //הוספה לממוצע שעות הכולל את הממוצע של יום אחד
        }

        //שמירת התוצאה הסופית
        FinalResults(finalOutputFile, allHourlyAverages);
        Console.WriteLine($"The file is created: {finalOutputFile}");
    }

    //פונקציה המחלקת את הקובץ הגדול לקבצים קטנים על פי ימים
    public static void SplitFileByDay(string inputFilePath, string outputDirectory)
    {
        if (!Directory.Exists(outputDirectory))
            Directory.CreateDirectory(outputDirectory);

        Dictionary<string, List<string>> dailyData = new Dictionary<string, List<string>>(); //מילון המכיל נתונים ליום אחד

        StreamReader reader = new StreamReader(inputFilePath);
        
            string header = reader.ReadLine(); //קריאת כותרת הקובץ
            string line;

            while ((line = reader.ReadLine()) != null)
            {
                string[] parts = line.Split(',');
                if (parts.Length != 2) continue;
           
                
                //בדיקות לחותמות זמן

            if (!DateTime.TryParse(parts[0].Trim(), out DateTime timestamp))
                continue;

            string dayKey = timestamp.ToString("yyyy-MM-dd");
                if (!dailyData.ContainsKey(dayKey))
                    dailyData[dayKey] = new List<string> { "timestamp,value" };

                dailyData[dayKey].Add(line);
            }
        

        foreach (var value in dailyData) //עובר על כל המילון של יום מסוים וכותב לתוך קובץ חדש בשם אותו יום לתוך תיקייה של קבצים מחולקים
        {
            File.WriteAllLines(Path.Combine(outputDirectory, $"{value.Key}.csv"), value.Value);
        }
    }

    //פונקציה המחשבת ממוצע שעתי עבור קובץ בודד ליום אחד
    public static List<(DateTime Hour, double Average)> CalculateHourAverages(string filePath)
    {
        Dictionary<DateTime, List<double>> hourData = new Dictionary<DateTime, List<double>>();

        StreamReader reader = new StreamReader(filePath);
        
            reader.ReadLine(); // דילוג על כותרת
            string line;

            while ((line = reader.ReadLine()) != null)
            {
                string[] parts = line.Split(','); //חילוק השורה לשתיים - חותמת זמן וערך
                if (parts.Length != 2) continue;

            if (!DateTime.TryParse(parts[0].Trim(), out DateTime timestamp))
                continue;

            if (!double.TryParse(parts[1].Trim(), out double value))
                value = double.NaN;

                DateTime hourKey = new DateTime(timestamp.Year, timestamp.Month, timestamp.Day, timestamp.Hour, 0, 0);

            //בדיקה אם לא נמצא במילון להוסיף את הערך למילון
                if (!hourData.ContainsKey(hourKey))
                    hourData[hourKey] = new List<double>();

                if (!double.IsNaN(value))
                    hourData[hourKey].Add(value);
            }
       

        return hourData
            .Where(value => value.Value.Count > 0) // התעלמות משעות ריקות
            .Select(value => (value.Key, value.Value.Average()))
            .ToList();
    }

    //פונקציה השומרת את התוצאה הסופית לקובץ חדש
    public static void FinalResults(string finalOutputFile, List<(DateTime Hour, double Average)> results)
    {
        results = results.OrderBy(x => x.Hour).ToList(); //מיון לפי שעות
        List<string> lines = new List<string> { "timestamp,average_value" };
        lines.AddRange(results.Select(r => $"{r.Hour:yyyy-MM-dd HH:mm},{r.Average.ToString(CultureInfo.InvariantCulture)}"));

        File.WriteAllLines(finalOutputFile, lines);
    }
}
