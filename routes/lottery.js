// 產生樂透號碼方法只要輸入樂透型別type:(0:大樂透,1:威力彩)與組數(sets)
function GenLotteryNumber2DArray(type, sets) 
{
    // 宣告變數
    let number, count;    // number: 儲存亂數值, count: 儲存號碼個數, 
    let number2;          // 儲存第二區號碼
    let biggestNumber;    // 儲存最大號碼
    let flag;            // 儲存產生的號碼是否重複的旗標: true:重複, false:不重複

    // 建立樂透號碼2D陣列: 第1維度的長度為sets，代表sets組組樂透號碼，第2維度的長度為7，代表可存7個號碼:
    // 大樂透(index 0~5:儲存大樂透號碼, index 6:儲存0)；威力彩(index 0~5儲存威力彩號碼, index 6儲存第二區號碼)
    let lotteryNumber2DArray = Array.from(Array(sets), () => new Array(7)); 
    
    if (type == 0) // 假如type為0，種類為大樂透，設定最大號碼為49
    {
        biggestNumber = 49;
    }
    else // 否則種類為威力彩，設定最大號碼為38
    {
        biggestNumber = 38;
    }

    // 產生sets組樂透號碼
    for (let i = 0; i < sets; i++)
    {
        // 初始化樂透號碼陣列，50(比最大號碼大的數字均可)在排序時會被排到整數陣列index6的位置
        for (let j = 0; j < 7; j++) lotteryNumber2DArray[i][j] = 50; 
        let count = 0; // 初始化號碼個數為0
        //
        do
        {
            // 產生1~biggestNumber的整數亂數
            number = Math.floor((Math.random() * biggestNumber) + 1);
            // 檢查產生的號碼是否重複: true:重複, false:不重複
            flag = exist(lotteryNumber2DArray[i], count, number);
            // 如果產生的號碼不重複
            if (flag == false) {
                lotteryNumber2DArray[i][count] = number; // 將產生的號碼存入樂透號碼陣列
                count++; // 號碼個數加1
            }
        } while (count < 6); // 重複產生號碼直到號碼個數為6個為止
        // 將樂透號碼陣列由小到大排序
        lotteryNumber2DArray[i].sort(function(a, b) { return a - b });

        if (type == 0)  // 假如種類為大樂透，index為6的號碼為0
        {
            lotteryNumber2DArray[i][6] = 0;
        }
        else // 否則種類為威力彩，index為6的號碼由亂數產生(第2區號碼)
        {
            number2 = Math.floor((Math.random() * 8) + 1); // 產生1~8的整數亂數
            lotteryNumber2DArray[i][6] = number2; // 將產生的號碼存入樂透號碼陣列
        }
    }
    return lotteryNumber2DArray;
}

// 判斷數字是否已經在樂透數字陣
function exist(numberArray, count, number) {
    let status = false;
    for (i = 0; i < count; i++) {
        if (numberArray[i] == number) {
            status = true;
            break;
        }
    }
    return status;
}
module.exports = GenLotteryNumber2DArray; // 將GenLotteryNumber2DArray函式匯出。