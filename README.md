# czech-post-address-filler

Extension for easier addressee registration on Czech Post website.

## Disclaimer

This extension currently doesn't work as inteded. In many cases, it will cause the Czech Post website to return an error and not be able to proceed with placing the order. I am currently exploring ways to make the extension work on Czech Post website.

## How to install

TBA

## How to use

1. Navigate to the [Parcel posting](https://www.postaonline.cz/odvozy/odvozbaliku/secure/parametrybaliku) page on Czech Post website (you must be logged in).
1. Open the extension and paste the address into the text field.
1. Wait for a few seconds, country will be selected and this will trigger a page reload.
1. The rest of the address should be parsed and filled in the remaining input fields.
1. Please check the correctness of the address before placing an order.

## Supported address formats

Formats currently supported by this extension are informed by the most commonly used two formats on Shopify:

```
# Used e.g. for Spain
name, street and number, [apt. number,] postal code + municipality, region, country, telephone

# Used e.g. for Canada
"name, street, municipality region postal code, country, telephone
```

If neither of these formats suit your needs, feel free to copy this extension's code and edit to your needs.
