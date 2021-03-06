package org.educama.airline.controller;


import org.educama.airline.businessservice.AirlineBusinessService;
import org.educama.airline.model.Airline;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

/**
 * Rest controller of the airline resources.
 */
@RestController
public class AirlineController {


    AirlineBusinessService airlineBusinessService;

    @Autowired
    public AirlineController(AirlineBusinessService airlineBusinessService) {
        this.airlineBusinessService = airlineBusinessService;
    }

    /**
     * Retrieves all airlines.
     *
     * @return the airlines
     */
    @RequestMapping("/airlines")
    public Page<Airline> getAirlines(Pageable pageable) {
        return airlineBusinessService.findAllAirlines(pageable);
    }

    /**
     * Retrieves an airline by its IATA or ICAO code.
     *
     * @param airportCode the IATA Code
     * @return the airline.
     */
    @RequestMapping("/airlines/{airportCode}")
    public List<Airline> getAirlinesByIataCodeOrIcaoCode(@PathVariable String airportCode) {
        Set<Airline> airlineSet = new HashSet<Airline>();
        if (StringUtils.isEmpty(airportCode)) {
            return Collections.emptyList();
        }
        airlineSet.addAll(airlineBusinessService.findAirlinesByIataCode(airportCode));
        airlineSet.addAll(airlineBusinessService.findAirlinesByIcaoCode(airportCode));
        return new ArrayList<>(airlineSet);

    }

    /**
     * Retrieves a list of airlines which name, IATA Code or ICAO Code starts with the given term.
     *
     * @param term the term to look up
     * @return the list of matching airlines.
     */
    @RequestMapping("/airlines/suggestions")
    public List<Airline> getAirlinesSuggestions(@RequestParam(value = "term") String term) {
        if (StringUtils.isEmpty(term)) {
            return Collections.emptyList();
        }

        return airlineBusinessService.findAirlineSuggestionsBySearchTerm(term);
    }

    /**
     * Replaces the content of the airlines database with the content of the CSV file the data contained in the csv
     * File.
     *
     * @param file the import file containing the airline data
     */
    @RequestMapping(value = "/airlines/import/csv", method = RequestMethod.POST)
    @ResponseBody
    public void importAirlines(@RequestParam("file") MultipartFile file) throws IOException {
        airlineBusinessService.clearAndImportAirlines(file);
    }
}
