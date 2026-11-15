// The demo content of the fictional Tolmerra Water Authority notices site (2004 to 2011). Every name, place, number and
// address here is invented for a demonstration. Phone numbers are from the ACMA list of numbers for fictional use;
// e-mail addresses use the reserved .example domain.

export const SITE = {
  name: 'Tolmerra Water Authority',
  database: 'Public Notices Database',
  lastUpdated: '14/03/2011',
  phone: '(03) 7010 4420',
  faults: '1800 160 401',
  email: 'notices@tolmerra.example',
  counter: '0042817',
};

// Newest first: the By Date view order. `key` is the readable document key in the URL.
export const NOTICES = [
  {
    key: 'water-restrictions-eased-to-stage-1', date: '14/03/2011', number: 'TWA-N-2011-031', category: 'Restrictions',
    area: 'All supply areas', title: 'Water restrictions eased to Stage 1',
    body: [
      'Stage 1 water restrictions apply across the Tolmerra supply area from Monday 21 March 2011, replacing Stage 2.',
      'Karrabee Reservoir has risen to 68 per cent after the summer rains. The Authority thanks customers for their efforts over the last fifteen months.',
      ['Gardens may be watered with a hand-held hose fitted with a trigger nozzle on any day, before 9 am and after 6 pm.',
        'Automatic sprinklers may be used on Tuesday and Saturday, before 7 am.',
        'Pools and spas may be topped up without a permit.'],
      'The full list of Stage 1 rules is available from the customer service centre.',
    ],
  },
  {
    key: 'boil-water-advice-lifted-wattleford', date: '02/02/2011', number: 'TWA-N-2011-012', category: 'Water quality',
    area: 'Wattleford', title: 'Boil water advice lifted: Wattleford',
    body: [
      'The boil water advice for Wattleford, issued on 28 January 2011, is lifted from 4 pm on Wednesday 2 February 2011.',
      'Test results from the Wattleford supply have met the drinking water guidelines for three days in a row.',
      ['Run each cold tap for two minutes before use.', 'Empty and clean ice trays and refill them from the tap.',
        'Replace water filter cartridges as the maker advises.'],
    ],
  },
  {
    key: 'boil-water-advice-wattleford', date: '28/01/2011', number: 'TWA-N-2011-009', category: 'Water quality',
    area: 'Wattleford', title: 'Boil water advice: Wattleford',
    body: [
      'As a precaution, customers in Wattleford must boil all water used for drinking, food and ice until further notice.',
      'Heavy rain has affected the quality of the water entering the Wattleford treatment plant. Crews are working to restore normal treatment.',
      ['Bring water to a rolling boil, then let it cool.', 'Use boiled or bottled water for drinking, cooking and cleaning teeth.',
        'Water for showers and washing clothes does not need to be boiled.'],
      'Free bottled water is available at the Wattleford Community Hall from 9 am to 5 pm each day.',
    ],
  },
  {
    key: 'karrabee-reservoir-spillway-works', date: '15/11/2010', number: 'TWA-N-2010-188', category: 'Works and outages',
    area: 'Karrabee', title: 'Karrabee Reservoir spillway works',
    body: [
      'Works to strengthen the Karrabee Reservoir spillway start on Monday 22 November 2010 and will take about twelve weeks.',
      'The picnic area and the walking track below the dam wall are closed while the works continue. The car park at the northern lookout stays open.',
      'Water supply is not affected.',
    ],
  },
  {
    key: 'annual-report-2009-10', date: '29/10/2010', number: 'TWA-N-2010-171', category: 'Corporate',
    area: 'All supply areas', title: 'Annual Report 2009-10',
    attachment: {name: 'twa-annual-report-2009-10.pdf', label: 'Annual Report 2009-10 (PDF, 2 KB)'},
    body: [
      'The Authority\'s Annual Report for 2009-10 was tabled on Friday 29 October 2010.',
      'The report covers water supply, water quality, the drought response and the Authority\'s finances for the year to 30 June 2010.',
    ],
  },
  {
    key: 'wattleford-road-water-main-replacement', date: '06/09/2010', number: 'TWA-N-2010-142', category: 'Works and outages',
    area: 'Wattleford', title: 'Wattleford Road water main replacement',
    body: [
      'The Authority is replacing 1.8 km of water main in Wattleford Road between Mill Street and the Karrabee Creek bridge.',
      'Works run from Monday 13 September to Friday 26 November 2010, from 7 am to 5 pm on weekdays. One lane stays open at all times.',
      'Residents affected by a planned interruption to supply will receive a card in the letterbox at least two days before.',
    ],
  },
  {
    key: 'fees-and-charges-2010-11', date: '01/07/2010', number: 'TWA-N-2010-101', category: 'Fees and charges',
    area: 'All supply areas', title: 'Fees and charges 2010-11',
    body: [
      'New fees and charges apply from 1 July 2010.',
      ['Water usage charge: $1.92 per kilolitre.', 'Service charge: $164.00 per year.', 'Meter reading on request: $38.00.'],
      'Concession card holders receive a rebate on the service charge. Ask the customer service centre for details.',
    ],
  },
  {
    key: 'mains-flushing-program-northern-suburbs', date: '17/05/2010', number: 'TWA-N-2010-077', category: 'Water quality',
    area: 'Karrabee North', title: 'Mains flushing program: northern suburbs',
    body: [
      'Crews will flush the water mains in the northern suburbs from Monday 24 May to Friday 18 June 2010.',
      'Water may be discoloured for a short time. Run a cold tap until the water is clear. Do not wash clothes while the water is discoloured.',
    ],
  },
  {
    key: 'stage-2-water-restrictions', date: '01/12/2009', number: 'TWA-N-2009-114', category: 'Restrictions',
    area: 'All supply areas', title: 'Stage 2 water restrictions',
    body: [
      'Stage 2 water restrictions apply across the Tolmerra supply area from Tuesday 1 December 2009.',
      'Karrabee Reservoir has fallen to 41 per cent of capacity after the driest winter on record. Restrictions help the supply last until the autumn rains.',
      ['Gardens may be watered with a hand-held hose fitted with a trigger nozzle on Tuesday, Thursday and Sunday, before 8 am and after 7 pm.',
        'Automatic sprinklers and drip systems are not permitted.',
        'Cars may be washed with a bucket, or at a commercial car wash.',
        'New pools may not be filled without a permit from the Authority.'],
      'Customers with a medical or business need may apply in writing for an exemption.',
    ],
  },
  {
    key: 'rainwater-tank-rebates', date: '10/08/2009', number: 'TWA-N-2009-083', category: 'Fees and charges',
    area: 'All supply areas', title: 'Rainwater tank rebates',
    body: [
      'Residential customers who install a rainwater tank of 2,000 litres or more may claim a rebate of up to $500.',
      'Send the claim form, the paid invoice and a photo of the installed tank to the customer service centre within 90 days of installation.',
    ],
  },
  {
    key: 'karrabee-east-planned-outage', date: '23/03/2009', number: 'TWA-N-2009-029', category: 'Works and outages',
    area: 'Karrabee East', title: 'Planned outage: Karrabee East',
    body: [
      'Water supply to Karrabee East will be off from 9 am to 2 pm on Wednesday 1 April 2009 while a valve is replaced.',
      'Keep a supply of water for drinking and cooking. Supply may be discoloured when it returns.',
    ],
  },
  {
    key: 'meter-reading-schedule', date: '02/06/2008', number: 'TWA-N-2008-061', category: 'Corporate',
    area: 'All supply areas', title: 'Meter reading schedule',
    body: [
      'Meters are read every three months. Please keep the meter clear and restrain dogs on reading days.',
      'The reading dates for each suburb are printed on the back of your account.',
    ],
  },
];

export const CATEGORIES = ['Restrictions', 'Water quality', 'Works and outages', 'Fees and charges', 'Corporate'];

export const ABOUT = {
  About: {
    title: 'About the Authority',
    body: [
      'Tolmerra Water Authority supplies drinking water to about 46,000 customers in Tolmerra, Karrabee and Wattleford.',
      'The Authority runs Karrabee Reservoir, two treatment plants and 640 km of water mains.',
      'This notices database lists public notices from 2004. Older notices are available on request.',
    ],
  },
  Contact: {
    title: 'Contact us',
    body: [
      'Customer service centre: 12 Reservoir Road, Tolmerra. Open 8.30 am to 4.30 pm, Monday to Friday.',
      `Phone: ${SITE.phone}`,
      `Faults and emergencies, 24 hours: ${SITE.faults}`,
      `E-mail: ${SITE.email}`,
    ],
  },
  Accessibility: {
    title: 'Accessibility',
    body: [
      'This site is designed to be viewed at a screen size of 800 x 600 or larger, with a version 5 browser or later.',
      'If you have trouble reading a notice, call the customer service centre and we will send you a printed copy.',
    ],
  },
};
