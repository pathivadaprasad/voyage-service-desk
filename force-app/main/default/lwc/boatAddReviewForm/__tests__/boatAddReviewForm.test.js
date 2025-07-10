import { createElement } from 'lwc';
import BoatAddReviewForm from 'c/boatAddReviewForm';

describe('c-boat-add-review-form', () => {
    afterEach(() => {
        // Clean up DOM after each test
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the form', () => {
        // Arrange
        const element = createElement('c-boat-add-review-form', {
            is: BoatAddReviewForm
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const form = element.shadowRoot.querySelector('form');
        expect(form).not.toBeNull();

        // Example: Check if there is an input for review comment (adjust selector to your markup)
        const input = element.shadowRoot.querySelector('textarea, input');
        expect(input).not.toBeNull();

        // Example: Check if submit button exists (adjust selector to your markup)
        const button = element.shadowRoot.querySelector('button');
        expect(button).not.toBeNull();
    });

    // You can add more tests here like user interaction, event firing, etc.
});
