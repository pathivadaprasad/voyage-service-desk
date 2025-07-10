public class VerifyDate {
    public static Date checkDate(Date inputDate) {
        Date today = Date.today();
        Date minDate = today.addMonths(-1); // 1 month before today
        Date maxDate = today.addMonths(1);  // 1 month after today

        if (inputDate >= minDate && inputDate <= maxDate) {
            return inputDate;
        } else {
            // Return the last day of the current month within the range
            return Date.newInstance(today.year(), today.month(), 1).addMonths(1).addDays(-1);
        }
    }
}
