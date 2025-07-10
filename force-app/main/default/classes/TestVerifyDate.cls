@isTest
public class TestVerifyDate {
    @isTest
    static void testDateWithinRange() {
        Date today = Date.today();
        Date validDate = today; // within the range
        Date result = VerifyDate.checkDate(validDate);
        System.assertEquals(validDate, result, 'Date should return itself if within range');
    }

    @isTest
    static void testDateBeforeRange() {
        Date inputDate = Date.today().addMonths(-2); // before allowed range
        Date expected = Date.newInstance(Date.today().year(), Date.today().month(), 1).addMonths(1).addDays(-1);
        Date result = VerifyDate.checkDate(inputDate);
        System.assertEquals(expected, result, 'Should return end of current month for early date');
    }

    @isTest
    static void testDateAfterRange() {
        Date inputDate = Date.today().addMonths(2); // after allowed range
        Date expected = Date.newInstance(Date.today().year(), Date.today().month(), 1).addMonths(1).addDays(-1);
        Date result = VerifyDate.checkDate(inputDate);
        System.assertEquals(expected, result, 'Should return end of current month for late date');
    }
}
