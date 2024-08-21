from bs4 import BeautifulSoup
import json

def parse_adresses():
    # Read the file

    file_contents = ""
    with open('addresses.html') as f:
        file_contents = f.read()

    soup = BeautifulSoup(file_contents, 'html.parser')
    addresses = soup.find_all(class_='option')

    # Parse the adresses
    output = dict()
    for address in addresses:
        output[address.text] = address.get("data-value"); 

    # Write the output to a file
    with open('addresses.json', 'w') as f:
        json.dump(output, f)

if __name__ == "__main__":
    parse_adresses()