#!/usr/bin/env python
# coding: utf-8

import pandas as pd
from haversine import haversine as hs
from IPython.display import display
import plotly.express as px

def load_cities(filename:str, country=None) -> pd.DataFrame:
  cities = pd.read_csv(filename)
  if country:
    cities = cities[cities["country"] == country]
  cities = cities.sort_values("population", ascending=False)
  return cities

def select_country_cities(cities: pd.DataFrame, country:str) -> pd.DataFrame:
  return cities[cities["country"] == country]

def get_largest(cities: pd.DataFrame, N_cities:int)-> pd.DataFrame:
  return cities[:N_cities]



def calculate_distances(cities:pd.DataFrame) -> pd.DataFrame:
  distances = []
  for _, city_1 in cities.iterrows():
    row = []
    for _, city_2 in cities.iterrows():
      city_1_gps = (city_1["lat"], city_1["lng"])
      city_2_gps = (city_2["lat"], city_2["lng"])
      distance = round(hs(city_1_gps, city_2_gps))
      row.append(distance)
    distances.append(row)
  return distances


def plot(cities: pd.DataFrame)-> None:
  fig = px.scatter_geo(data_frame=cities, lat="lat", lon="lng", hover_name="city", projection="orthographic")
  fig.show()


def plot_path(cities: pd.DataFrame, path: list)-> None:
  cities_path = cities.reindex(path)
  fig = px.line_geo(data_frame=cities_path, lat="lat", lon="lng", hover_name="city", projection="orthographic")
  fig.show()



def tutorial():
  cities = load_cities("worldcities.csv")
  french_cities = select_country_cities(cities, "France")
  display(cities)

  largest_cities = get_largest(french_cities, 10)
  distances = calculate_distances(largest_cities)

  cities_names = list(largest_cities["city_ascii"])
  
  distances = pd.DataFrame(distances, columns=cities_names, index=cities_names)
  display(distances)

  plot(largest_cities)
  plot_path(largest_cities, largest_cities.index)



if __name__ == "__main__":
  tutorial()