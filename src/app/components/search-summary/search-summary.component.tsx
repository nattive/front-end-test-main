import React from 'react';
import styles from './search-summary.module.css';
import { parseDate } from '@/utils/composition.service';

interface PartyComposition {
    adults: number;
    children: number;
    childAges?: number[];
    infants?: number;
}

interface SearchSummaryProps {
    bookingType: string;
    location: string;
    departureDate: string;
    duration: string;
    gateway: string;
    partyCompositions: any
    onEditSearch?: () => void;
}

const SearchSummary: React.FC<SearchSummaryProps> = ({
    bookingType,
    location,
    departureDate,
    duration,
    gateway,
    partyCompositions,
    onEditSearch
}) => {
    console.log({ departureDate });

    const formatDate = () => {
        /**
         * reformat the date to appropriate format
         * accepted by javascript new Date
         */
        const departDate = new Date(parseDate(departureDate));
        const returnDate = new Date(departDate);
        returnDate.setDate(returnDate.getDate() + +duration);

        return {
            depart: departDate.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            return: returnDate.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
        };
    };

    const formatPartyComposition = (parties: PartyComposition[]) => {
        const totalRooms = parties.length;
        const totalAdults = parties.reduce((sum, party) => sum + party.adults, 0);
        const totalChildren = parties.reduce((sum, party) => sum + (party.children || 0), 0);
        const totalInfants = parties.reduce((sum, party) => sum + (party.infants || 0), 0);

        let text = `${totalRooms} ${totalRooms === 1 ? 'room' : 'rooms'} / `;
        text += `${totalAdults} ${totalAdults === 1 ? 'adult' : 'adults'}`;

        if (totalChildren > 0) {
            text += ` / ${totalChildren} ${totalChildren === 1 ? 'child' : 'children'}`;
        }

        if (totalInfants > 0) {
            text += ` / ${totalInfants} ${totalInfants === 1 ? 'infant' : 'infants'}`;
        }

        return text;
    };

    const dates = formatDate();

    return (
        <div className={styles.searchBar}>
            <div className={styles.container}>
                <div className={styles.searchGrid}>
                    <div className={styles.searchItem}>
                        <span className={styles.label}>YOU SEARCHED FOR</span>
                        <span className={styles.value}>{bookingType}</span>
                    </div>

                    <div className={styles.searchItem}>
                        <span className={styles.label}>GOING TO</span>
                        <span className={styles.value}>{location}</span>
                    </div>

                    <div className={styles.searchItem}>
                        <span className={styles.label}>FLYING FROM</span>
                        <span className={styles.value}>{gateway}</span>
                    </div>

                    <div className={styles.searchItem}>
                        <span className={styles.label}>DEPART</span>
                        <span className={styles.value}>{dates.depart}</span>
                    </div>

                    <div className={styles.searchItem}>
                        <span className={styles.label}>RETURN</span>
                        <span className={styles.value}>{dates.return}</span>
                    </div>

                    <div className={styles.searchItem}>
                        <span className={styles.label}>DURATION</span>
                        <span className={styles.value}>{duration} nights</span>
                    </div>

                    <div className={styles.searchItem}>
                        <span className={styles.label}>ROOM & GUESTS</span>
                        <span className={styles.value}>
                            {formatPartyComposition(partyCompositions)}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchSummary;