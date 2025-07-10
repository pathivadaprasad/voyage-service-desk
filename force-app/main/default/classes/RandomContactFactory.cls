public class RandomContactFactory {
    public static List<Contact> generateRandomContacts(Integer count, String lastName) {
        List<Contact> contacts = new List<Contact>();
        
        for (Integer i = 0; i < count; i++) {
            Contact c = new Contact(
                FirstName = 'Test ' + i,
                LastName = lastName
            );
            contacts.add(c);
        }
        
        return contacts;
    }
}
