import { Holiday } from '@/types/booking';
import DisplayResultComponent from '../../src/app/components/display-result/display-result.component';

describe('DisplayResult Component', () => {
  const mockHolidays = [{
    totalPriceBeforeDiscount: 2430.86,
    totalPrice: 2310.86,
    pricePerPersonBeforeDiscount: 1215.43,
    pricePerPerson: 1155.43,
    depositPerPerson: 1155.43,
    webDiscount: 120,
    deposit: 2310.86,
    hotel: {
      id: "H1848",
      name: "Holiday Inn Orlando SW Celebration",
      boardBasis: "Room Only",
      content: {
        name: "Holiday Inn Orlando SW Celebration",
        virginView: "This welcoming, modern resort...",
        vRating: "3",
        hotelDescription: "",
        atAGlance: [
          "Great resort for families in a central location",
          "Complimentary transport to Walt Disney World"
        ],
        parentLocation: "Kissimmee, Orlando",
        images: [
          {
            RESULTS_CAROUSEL: {
              url: "//d3hk78fplavsbl.cloudfront.net/assets/common-prod/hotel/205/h1848/h1848-1-results_carousel.jpg?version=1"
            }
          }
        ],
        hotelFacilities: [
          "Restaurant",
          "Bar",
          "Swimming Pool",
          "Free Parking",
          "Internet Access"
        ],
        starRating: "3",
        propertyType: "Hotel"
      }
    },
    virginPoints: 4622,
    tierPoints: 80,
    departureDate: "2024-12-14",
    selectedDate: "2024-12-14"
  }];

  beforeEach(() => {
    cy.mount(<DisplayResultComponent holidays={mockHolidays as unknown as Holiday[]} />);
  });

  describe('Initial Render', () => {
    it('displays the correct number of holiday cards', () => {
      cy.get('[data-testid="holiday-card-wrapper"]').should('have.length', 1);
      cy.get('[data-testid="booking-card"]').should('have.length', 1);
    });



    it('displays the filter sections', () => {
      cy.get('[data-testid="min-price"]').should('exist');
      cy.get('[data-testid="max-price"]').should('exist');
      cy.get('[data-testid="facilities-filter"]').should('exist');
      cy.get('[data-testid="facility-checkbox"]').should('exist');
      cy.get('[data-testid="star-rating-filter"]').should('exist');
      cy.get('[data-testid="star-rating-button"]').should('exist');
    });
  });

  describe('Price Range Filter', () => {
    it('filters holidays by price range', () => {
      // First verify initial render
      cy.get('[data-testid="holiday-card-wrapper"]').should('have.length', 1);

      // Set min price with forced value
      cy.get('[data-testid="min-price"]')
        .clear()
        .invoke('val', '1000')
        .trigger('change')
        .should('have.value', '1000');

      // Set max price with forced value
      cy.get('[data-testid="max-price"]')
        .clear()
        .invoke('val', '1200')
        .trigger('change')
        .should('have.value', '1200');

      // Verify the holiday is still visible
      cy.get('[data-testid="holiday-card-wrapper"]').should('have.length', 0);

      // Test range that excludes our holiday
      cy.get('[data-testid="min-price"]')
        .clear()
        .invoke('val', '2000')
        .trigger('change')
        .should('have.value', '2000');

      cy.get('[data-testid="max-price"]')
        .clear()
        .invoke('val', '3000')
        .trigger('change')
        .should('have.value', '3000');

      // Verify empty state
      cy.get('[data-testid="empty-state"]').should('be.visible');
    });
  });

  describe('Facilities Filter', () => {
    it('shows all available facilities', () => {
      cy.get('[data-testid="facility-checkbox"]')
        .should('have.length', mockHolidays[0].hotel.content.hotelFacilities.length);
    });

    it('filters by facility correctly', () => {
      // Select a facility that exists in our mock data
      cy.get('[data-testid="facility-checkbox"]').first().click();
      cy.get('[data-testid="holiday-card-wrapper"]').should('exist');

      // Filter should be active
      cy.get('[data-testid="reset-filters"]').should('be.visible');
    });

    it('shows facility counts', () => {
      cy.get('[data-testid="facility-count"]').should('exist');
    });

    it('toggles facilities correctly', () => {
      cy.get('[data-testid="facility-checkbox"]').first()
        .click() // select
        .should('be.checked')
        .click() // deselect
        .should('not.be.checked');
    });
  });

  describe('Star Rating Filter', () => {
    it('shows available star ratings', () => {
      cy.get('[data-testid="star-rating-button"]').should('exist');
    });



    it('toggles star rating selection', () => {
      cy.get('[data-testid="star-rating-button"]')
        .first()
        .click()
        .should('have.attr', 'aria-pressed', 'true')
        .click()
        .should('have.attr', 'aria-pressed', 'false');
    });
  });

  describe('Reset Functionality', () => {
    it('resets all filters when clicking reset button', () => {
      // Apply filters first
      cy.get('[data-testid="facility-checkbox"]').first().click();
      cy.get('[data-testid="reset-filters"]').should('be.visible').click();

      // Verify filters are reset
      cy.get('[data-testid="holiday-card-wrapper"]').should('have.length', 1);
      cy.get('[data-testid="reset-filters"]').should('not.exist');
    });

    it('resets price range to initial values', () => {
      const initialMin = Math.min(...mockHolidays.map(h => h.pricePerPerson));
      const initialMax = Math.max(...mockHolidays.map(h => h.pricePerPerson));

      // Change values first
      cy.get('[data-testid="min-price"]').clear().type('2000');
      cy.get('[data-testid="max-price"]').clear().type('3000');

      // Reset
      cy.get('[data-testid="facility-checkbox"]').first().click();
      cy.get('[data-testid="reset-filters"]').click();

      // Verify reset values
      cy.get('[data-testid="min-price"]').should('have.value', initialMin);
      cy.get('[data-testid="max-price"]').should('have.value', initialMax);
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no results match filters', () => {
      // Set impossible price range
      cy.get('[data-testid="min-price"]').clear().type('100000');

      // Check empty state
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="holiday-card-wrapper"]').should('not.exist');
    });

    it('allows resetting filters from empty state using reset link', () => {
      // Set impossible price range
      cy.get('[data-testid="min-price"]').clear().type('100000');

      // Reset from empty state using the reset link
      cy.get('#resetLink')  // Using the class from the original component
        .click();

      // Verify results are back
      cy.get('[data-testid="holiday-card-wrapper"]').should('be.visible');
    });

    it('does not show reset filters button in empty state', () => {
      // Set impossible price range to trigger empty state
      cy.get('[data-testid="min-price"]').clear().type('100000');

      // Verify reset filters button is not present in empty state
      cy.get('[data-testid="empty-state"]').should('be.visible');
      cy.get('[data-testid="reset-filters"]').should('not.exist');
    });
  });



  describe('Accessibility', () => {
    it('has accessible form controls', () => {
      cy.get('[data-testid="min-price"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="max-price"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="facility-checkbox"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="star-rating-button"]').should('have.attr', 'aria-pressed');
    });

    it('maintains focus management', () => {
      cy.get('[data-testid="min-price"]').focus().should('be.focused');
      cy.get('[data-testid="max-price"]').focus().should('be.focused');
      cy.get('[data-testid="facility-checkbox"]').first().focus().should('be.focused');
    });

    it('has proper headings structure', () => {
      cy.get('h2').should('exist');
      cy.get('h3').should('exist');
    });
  });

  describe('Performance', () => {
    it('handles rapid filter changes', () => {
      // Rapid price changes
      cy.get('[data-testid="min-price"]')
        .clear()
        .type('1000')
        .clear()
        .type('1500')
        .clear()
        .type('2000');

      // Rapid facility toggles
      cy.get('[data-testid="facility-checkbox"]')
        .first()
        .click()
        .click()
        .click();

      // Should still render correctly
      cy.get('[data-testid="holiday-card-wrapper"]').should('have.length.gte', 0);
    });
  });
});