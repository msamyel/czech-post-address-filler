from bs4 import BeautifulSoup
import json
import re

def parse_adresses():
    # Read the file

    file_contents = ""
    with open('addresses.html') as f:
        file_contents = f.read()

    soup = BeautifulSoup(file_contents, 'html.parser')
    addresses = soup.find_all(class_='option')


    output = "countries = {"
    # Write the output to a file
        
    for address in addresses:
        country_name = address.text
        country_name = re.sub(r"[\(\[].*?[\)\]]", "", country_name)
        output += '"' + address.get("data-value") + '": "' + country_name.strip() + '",'; 
    
    output = output + "}"

    with open('addresses.js', 'w') as f:
        f.write(output)

if __name__ == "__main__":
    parse_adresses()