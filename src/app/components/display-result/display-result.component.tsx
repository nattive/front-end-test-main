"use client"
import { useState, useEffect } from 'react';
import { Holiday } from '@/types/booking';
import styles from './display-results.module.css';
import BookingCard from '@/components/BookingCard';
import { renderStars } from '@/utils/helper';

interface Filters {
    priceRange: { min: number; max: number };
    facilities: string[];
    starRating: (number | string)[];
}

interface FilterCounts {
    [key: string]: number;
}

const DisplayResultComponent = ({ holidays }: { holidays: Holiday[] }) => {

    // Initialize min/max price
    const minPrice = Math.min(...holidays.map(h => h.pricePerPerson));
    const maxPrice = Math.max(...holidays.map(h => h.pricePerPerson));

    const [filters, setFilters] = useState<Filters>({
        priceRange: { min: minPrice, max: maxPrice },
        facilities: [],
        starRating: []
    });

    const [filteredResults, setFilteredResults] = useState<Holiday[]>(holidays);

    /**
     * loops through and count the numbers of 
     * unique facility in the holiday. 
     * @returns FilterCounts
     */
    const getFacilityCounts = (): FilterCounts => {
        return holidays.reduce((acc, holiday) => {
            holiday.hotel.content.hotelFacilities.forEach(facility => {
                acc[facility] = (acc[facility] || 0) + 1;
            });
            return acc;
        }, {} as FilterCounts);
    };

    /**
     * loops through the ratings.
     * filter off rating that is a string
     * sort in descending order.
     * @returns {string[] | number[]}
     */
    const getUniqueStarRatings = () => {
        return Array.from(
            new Set(holidays.map(holiday => holiday.hotel.content.starRating))
        ).filter(rating => !Number.isNaN(+rating))
            .sort((a, b) => {
                if (typeof a === 'number' && typeof b === 'number') return b - a;
                return String(b).localeCompare(String(a));
            });
    };

    // Memoize counts and ratings
    const facilityCount = getFacilityCounts();
    const allStarRatings = getUniqueStarRatings();



    // Filter holidays
    useEffect(() => {
        const filtered = holidays.filter(holiday => {
            const price = holiday.pricePerPerson;
            const facilities = holiday.hotel.content.hotelFacilities;
            const starRating = holiday.hotel.content.starRating;

            const matchesPrice =
                price >= filters.priceRange.min &&
                price <= filters.priceRange.max;

            const matchesFacilities =
                filters.facilities.length === 0 ||
                filters.facilities.every(f => facilities.includes(f));

            const matchesStarRating =
                filters.starRating.length === 0 ||
                filters.starRating.includes(starRating);

            return matchesPrice && matchesFacilities && matchesStarRating;
        });

        setFilteredResults(filtered);
    }, [filters, holidays]);

    // Filter handlers
    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        setFilters(prev => ({
            ...prev,
            priceRange: { ...prev.priceRange, [type]: value }
        }));
    };

    const handleFacilityToggle = (facility: string) => {
        setFilters(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleStarRatingToggle = (rating: number | string) => {
        setFilters(prev => ({
            ...prev,
            starRating: prev.starRating.includes(rating)
                ? prev.starRating.filter(r => r !== rating)
                : [...prev.starRating, rating]
        }));
    };




    /**
     * function to reset all filters to default
     */
    const resetFilters = () => {
        setFilters({
            priceRange: { min: minPrice, max: maxPrice },
            facilities: [],
            starRating: []
        });
    };

    /**
     * checks if filters has been applied
     */
    const hasActiveFilters = filters.facilities.length > 0 || filters.starRating.length > 0;

    return (
        <div className={styles.container}>
            <div className={styles.filtersContainer}>
                <div className={styles.filterHeader}>
                    <h2 className={styles.sectionTitle}>Filter Holidays</h2>
                    {hasActiveFilters && (
                        <button
                            data-testid="reset-filters"
                            onClick={resetFilters}
                            className={styles.resetButton}
                            aria-label="Reset all filters"
                        >
                            Reset all
                        </button>
                    )}
                </div>

                {/* Price Range Filter */}
                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Price Per Person</h3>
                    <div className={styles.priceRange}>
                        <div className={styles.priceInputGroup}>
                            <span className={styles.priceInputLabel}>From</span>
                            <input
                                data-testid="min-price"
                                type="number"
                                value={filters.priceRange.min}
                                onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                                className={styles.priceInput}
                                min="0"
                                aria-label="Minimum price"
                            />
                        </div>
                        <div className={styles.priceInputGroup}>
                            <span className={styles.priceInputLabel}>To</span>
                            <input
                                data-testid="max-price"
                                type="number"
                                value={filters.priceRange.max}
                                onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                                className={styles.priceInput}
                                min="0"
                                aria-label="Maximum price"
                            />
                        </div>
                    </div>
                </div>

                {/* Facilities Filter */}
                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Hotel Facilities</h3>
                    <div data-testid="facilities-filter" className={styles.checkboxGroup}>
                        {Object.entries(facilityCount)
                            .sort(([, a], [, b]) => b - a)
                            .map(([facility, count]) => (
                                <label key={facility} className={styles.checkboxItem}>
                                    <input
                                        data-testid="facility-checkbox"
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={filters.facilities.includes(facility)}
                                        onChange={() => handleFacilityToggle(facility)}
                                        aria-label={`Filter by ${facility}`}
                                    />
                                    <span className={styles.checkboxLabel}>
                                        {facility}
                                        <span data-testid="facility-count" className={styles.itemCount}>({count})</span>
                                    </span>
                                </label>
                            ))}
                    </div>
                </div>

                {/* Star Rating Filter */}
                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Star Rating</h3>
                    <div
                        data-testid="star-rating-filter"
                        className={styles.starRatingGroup}>
                        {allStarRatings.map(rating => (
                            <button
                                key={rating}
                                data-testid="star-rating-button"
                                onClick={() => handleStarRatingToggle(rating)}
                                className={filters.starRating.includes(rating)
                                    ? styles.starRatingButtonActive
                                    : styles.starRatingButton}
                                aria-pressed={filters.starRating.includes(rating)}
                            >
                                <span className={styles.stars}>
                                    {renderStars(rating)}
                                </span>
                                <span className={styles.itemCount}>
                                    ({holidays.filter(h => h.hotel.content.starRating === rating).length})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className={styles.resultsSection}>
                <div className={styles.resultsHeader}>
                    <h2 className={styles.resultsTitle}>
                        {filteredResults.length} {filteredResults.length === 1 ? 'Holiday' : 'Holidays'} Found
                    </h2>
                </div>

                {filteredResults.map((holiday) => (
                    <div data-testid="holiday-card-wrapper" key={holiday.hotel.id}>
                        <BookingCard holiday={holiday} />
                    </div>
                ))}

                {filteredResults.length === 0 && (
                    <div data-testid="empty-state" className={styles.emptyState}>
                        <h3 className={styles.emptyStateTitle}>No holidays found</h3>
                        <p className={styles.emptyStateMessage}>
                            Try adjusting your filters or{' '}
                            <button
                                id='resetLink'
                                data-testid="resetLink'"
                                onClick={resetFilters}
                                className={styles.resetLink}
                            >
                                reset all filters
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayResultComponent;