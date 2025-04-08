using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Parquet;
using Parquet.Data;
using System.Linq;

class Program
{
    public static void Main()
    {
        string FileName = "time_series.parquet";  //time_series.csv parquet
        string outputFileName = "hourly_averages.csv";


        List<(DateTime timestamp, double value)> data;

        // זיהוי הסיומת והפניית הקריאה לפונקציה המתאימה
        string extension = Path.GetExtension(FileName).ToLower();

        if (extension == ".csv")
        {
            data = ReadCsv(FileName); //פונקציה לקריאת קבצי CSV
        }
        else if (extension == ".parquet")
        {
            data = ReadParquet("time_series.parquet").Result; //פונקציה לקריאת קבצי parquet

        }
        else
        {
            Console.WriteLine("Unsupported file format."); //סיומת לא מוכרת
            return;
        }

        if (data.Count == 0)
        {
            Console.WriteLine("No valid data in the file.");
            return;
        }


        // חישוב ממוצעים שעתיים
        Dictionary<DateTime, double> hourlyAverages = CalculateHourlyAverages(data);

        // הדפסת התוצאות
        PrintResults(hourlyAverages);

        // כתיבת התוצאות לקובץ
        WriteCsv(outputFileName, hourlyAverages);

        Console.WriteLine($"The data was saved in the file: {outputFileName}");
    }

    //פונקציה לקריאת קבצי CSV
    public static List<(DateTime, double)> ReadCsv(string fileName)
    {
        List<(DateTime, double)> data = new List<(DateTime, double)>();

        try
        {
            StreamReader reader = new StreamReader(fileName);
                string header = reader.ReadLine();

                if (string.IsNullOrEmpty(header))
                    return data;

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    string[] parts = line.Split(','); // פיצול לשני חלקים: חותמת זמן וערך

                if (parts.Length != 2)
                        continue;

                if (!DateTime.TryParse(parts[0].Trim(), out DateTime timestamp)) //המרה לתאריך
                    continue;

                if (!double.TryParse(parts[1].Trim(), out double value)) //המרה לערך
                    continue;

                data.Add((timestamp, value));
                }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error reading CSV file: {ex.Message}");
        }

        return data;
    }

    //פונקציה לקריאת קבצי Parquet
    public static async Task<List<(DateTime, double)>> ReadParquet(string fileName)
    {
        List<(DateTime, double)> data = new List<(DateTime, double)>();

        try
        {
            using Stream fileStream = File.OpenRead(fileName);
            var reader = await ParquetReader.CreateAsync(fileStream);

            for (int i = 0; i < reader.RowGroupCount; i++) //מעבר על כל השורות בקובץ
            {
                var rowGroupReader = reader.OpenRowGroupReader(i);

                var dataColumns = new List<DataColumn>();

                foreach (var j in reader.Schema.GetDataFields())
                {
                    var column = await rowGroupReader.ReadColumnAsync(j);
                    dataColumns.Add(column);
                }

                var timestampColumn = dataColumns.FirstOrDefault(c => c.Field.Name.ToLower().Contains("timestamp")); //המרה לחותמת זמן
                var valueColumn = dataColumns.FirstOrDefault(c => c.Field.Name.ToLower().Contains("value")); //המרה לערך

                if (timestampColumn == null || valueColumn == null)
                {
                    Console.WriteLine("לא נמצאו עמודות timestamp ו-value");
                    return data;
                }


                int length = timestampColumn.Data.Length;
                var timestamps = new DateTime[length];
                var values = new double[length];

                for (int k = 0; k < length; k++)
                {
                    var tsObj = timestampColumn.Data.GetValue(k);
                    var valObj = valueColumn.Data.GetValue(k);

                    if (tsObj == null || valObj == null)
                    {
                        Console.WriteLine($"שורה {k}: ערך null נמצא בקובץ Parquet.");
                        continue;
                    }


                    DateTime timestamp = Convert.ToDateTime(tsObj);
                    double value = Convert.ToDouble(valObj);

                    if (double.IsNaN(value))
                    {
                        continue;
                    }

                    data.Add((timestamp, value));
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"שגיאה בקריאת קובץ Parquet: {ex.Message}");
        }

        return data;
    }


    // פונקציה המחשבת ממוצעים שעתיים
    public static Dictionary<DateTime, double> CalculateHourlyAverages(List<(DateTime timestamp, double value)> data)
    {
        Dictionary<DateTime, List<double>> hourlyData = new Dictionary<DateTime, List<double>>();

        foreach (var value in data)
        {
            // יצירת מפתח לשעה שלמה
            DateTime hourKey = new DateTime(value.timestamp.Year, value.timestamp.Month, value.timestamp.Day, value.timestamp.Hour, 0, 0);

            if (!hourlyData.ContainsKey(hourKey))
                hourlyData[hourKey] = new List<double>(); //הוספת השעה אם לא נמצאת במילון

            if (!double.IsNaN(value.value))
                hourlyData[hourKey].Add(value.value);  // הוספת ערך לרשימה של השעה
        }

        //// הדפסה של כל שעה והסכום הכולל לפני חישוב ממוצע
        //foreach (var kvp in hourlyData)
        //{
        //    double sum = kvp.Value.Sum();
        //    int count = kvp.Value.Count;
        //    Console.WriteLine($"שעה: {kvp.Key}, כמות ערכים: {count}, סכום כולל: {sum}");
        //}



        // חישוב ממוצע עבור כל שעה
        return hourlyData
            .Where(value => value.Value.Count > 0)
            .ToDictionary(key => key.Key, value => value.Value.Average());
    }

    //פונקציה המדפיסה את התוצאות
    public static void PrintResults(Dictionary<DateTime, double> hourlyAverages)
    {
        Console.WriteLine("|    Start time       |Average|");
        Console.WriteLine("|---------------------|--------|");

        foreach (var value in hourlyAverages.OrderBy(v => v.Key))
        {
            Console.WriteLine($"| {value.Key:yyyy-MM-dd HH:mm:ss} | {value.Value} |");
        }
    }

    //פונקציה הכותבת את התוצאות לקובץ CSV
    static void WriteCsv(string filePath, Dictionary<DateTime, double> hourlyAverages)
    {
        try
        {
            StreamWriter writer = new StreamWriter(filePath);
                writer.WriteLine("זמן התחלה,ממוצע");

                foreach (var value in hourlyAverages.OrderBy(v => v.Key))
                {
                    writer.WriteLine($"{value.Key:yyyy-MM-dd HH:mm:ss},{value.Value}");
                }
            }
        catch (Exception ex)
        {
            Console.WriteLine($"שגיאה בכתיבת הקובץ: {ex.Message}");
        }
    }
}
