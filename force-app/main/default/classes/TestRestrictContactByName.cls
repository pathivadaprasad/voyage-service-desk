@isTest
public class TestRestrictContactByName {

    @isTest
    static void testInsertInvalidContact() {
        Contact invalidContact = new Contact(FirstName = 'Test', LastName = 'INVALIDNAME');

        Test.startTest();
        try {
            insert invalidContact;
            System.assert(false, 'Insert should have thrown an exception.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('INVALIDNAME'), 'Expected error for INVALIDNAME');
        }
        Test.stopTest();
    }

    @isTest
    static void testUpdateInvalidContact() {
        Contact validContact = new Contact(FirstName = 'Test', LastName = 'ValidName');
        insert validContact;

        validContact.LastName = 'INVALIDNAME';

        Test.startTest();
        try {
            update validContact;
            System.assert(false, 'Update should have thrown an exception.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('INVALIDNAME'), 'Expected error for INVALIDNAME');
        }
        Test.stopTest();
    }

    @isTest
    static void testValidContactInsert() {
        Contact validContact = new Contact(FirstName = 'Test', LastName = 'ValidName');

        Test.startTest();
        insert validContact;
        Test.stopTest();

        System.assertNotEquals(null, validContact.Id, 'Valid contact should be inserted.');
    }
}
