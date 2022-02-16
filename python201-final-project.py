import requests

pokemon = input('Which pokemon would you like ot know about? ')
url = f'https://pokeapi.co/api/v2/pokemon/{pokemon}'

info = requests.get(url).json()
print(f"{info['name'].capitalize()} has a height of {info['height']} a weight of {info['weight']} and is the {info['order']}th pokemon")
