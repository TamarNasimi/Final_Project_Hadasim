
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

class Program
{
    public static void Main()
    {
        string fileName = "logs.txt";  // שם קובץ הלוג
        int sizeLine = 10000;        // מספר השורות בכל קובץ
        

        // שורת קוד שמבקש מהמשתמש את מספר N
        Console.Write("Enter the number of top error codes to display: ");
        int N;

        // מוודאים שהמשתמש הזין מספר תקני
        while (!int.TryParse(Console.ReadLine(), out N) || N <= 0)
        {
            Console.Write("Please enter a valid positive integer for N: ");
        }


        List<string> namesFiles = SplitLogFile(fileName, sizeLine); //מכיל את שמות הקבצים שנוצרו לאחר הפיצול
        Dictionary<string, int> mergedCounts = CountLogs(namesFiles);//מילון המכיל את שם השגיאה ומספר הפעמים
        DisplayTopErrors(mergedCounts, N);
    }

    // פונקציה המפצלת את הקובץ למספר קבצים קטנים
    static List<string> SplitLogFile(string fileName, int sizeLine)
    {
        List<string> namesFiles = new List<string>(); //רשימה המכילה את שמות הקבצים הקטנים
        int fileIndex = 0; //כמות קבצים שנוצרו
        int lineCount = 0; //מספר שורות שנקראו

        StreamReader reader = new StreamReader(fileName); //פתיחת הקובץ הגדול לקריאה
        StreamWriter writer = null;

        while (!reader.EndOfStream) //לולאה שעוברת על כל הקובץ הגדול
        {
            if (lineCount % sizeLine == 0) //אם מתחלק צריך לפתוח קובץ חדש
            {
                writer?.Close(); //בדיקה שאין קובץ שנשאר פתוח
                string fileLogName = $"fileLog_{fileIndex}.txt";
                namesFiles.Add(fileLogName);
                writer = new StreamWriter(fileLogName);
                fileIndex++;
            }

            //כתיבת שורות מהקובץ הגדול לקובץ הקטן
            string line = reader.ReadLine();
            writer.WriteLine(line);
            lineCount++;
        }

        writer?.Close();
        reader.Close();

        return namesFiles;
    }

    //פונקציה העוברת על כל קובץ קטן וסופרת את התדירות של כל קוד שגיאה
    static Dictionary<string, int> CountLogs(List<string> partFiles)
    {
        Dictionary<string, int> globalCounts = new Dictionary<string, int>(); //מילון לספירות השגיאות מכל הקבצים

        foreach (string partFile in partFiles) //לולאה העוברת על כל קובץ קטן
        {
            Dictionary<string, int> localCounts = new Dictionary<string, int>(); //מילון לקובץ אחד

            StreamReader reader = new StreamReader(partFile);
            {
                while (!reader.EndOfStream) // לולאה שרצה על כל קובץ קטן
                {
                    string line = reader.ReadLine().Trim(); // קריאת השורה של השגיאה

                    // שימוש ב-Regex לחילוץ קוד השגיאה בלבד
                    Match match = Regex.Match(line, @"Error:\s*(\S+)");
                    if (match.Success)
                    {
                        string errorCode = match.Groups[1].Value; // קוד השגיאה הנקי

                        if (!localCounts.ContainsKey(errorCode))
                            localCounts[errorCode] = 0;

                        localCounts[errorCode]++;
                    }
                }

                reader.Close();
            }

            // מיזוג עם הספירות הכלליות
            foreach (var kvp in localCounts) //לולאה שעוברת על המילון של הקובץ הנוכחי
            {
                if (!globalCounts.ContainsKey(kvp.Key)) //בדיקה האם לא מופיע במילון הגדול, הגלובלי
                    globalCounts[kvp.Key] = 0;

                globalCounts[kvp.Key] += kvp.Value;
            }
        }

        return globalCounts; // הפונקציה מחזירה מילון  עם השגיאות וכמות השגיאות מכל הקבצים
    }

    // פונקציה המוצאת את השגיאות השכיחות ומדפיסה אותם
    static void DisplayTopErrors(Dictionary<string, int> errorCounts, int N)
    {
        var topErrors = errorCounts.OrderByDescending(kvp => kvp.Value) //מיון המילון מהגדול לקטן
                                   .Take(N); //לוקחים מהמילון את N השגיאות הראשונות

        Console.WriteLine("Top " + N + " Error Codes:");
        foreach (var error in topErrors)
        {
            Console.WriteLine($"{error.Key}: {error.Value} ");
        }
    }
}



//סיבוכיות:

//סיבוכיות זמן:
// סיבוכיות פונקציה: SplitLogFile(fileName, sizeLine) = O(M) כאשר M הוא מספר השורות בקובץ הגדול
//סיבוכיות פונקציה: CountLogs(partFiles) = O(M) 
// סיבוכיות פונקציה: DisplayTopErrors(errorCounts, N) = O(ElogE) כאשר E זה מספר השגיאות 
//סה"כ:
//O(M+ElogE)
// בעצם O(M) אך אם E קרוב ל-M הסיבוכיות תהיה O(MlogM)

//סיבוכיות מקום:
//סיבוכיות פונקציה: SplitLogFile(fileName, sizeLine) = O(K) כאשר K הוא מספר הקבצים שנוצרו
//סיבוכיות פונקציה: CountLogs(partFiles) = O(E) כאשר E זה כמות קודי שגיאה יחודיים
//סיבוכיות פונקציה: DisplayTopErrors(errorCounts, N) = O(E)  כאשר E זה כמות קודי שגיאה יחודיים
//סה"כ:
//הזכרון תלוי במספר קודי השגיאות השונים, סה"כ סיבוכיות המקום לכל התכנית:
//O(E) כאשר E זה מספר קודי השגיאות היחודיים שקיימים בקובץ