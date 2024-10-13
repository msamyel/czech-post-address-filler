# czech-post-address-filler

Extension for easier addressee registration on [Czech Post website](https://www.postaonline.cz/).

## How to install

TBA

## How to use

1. Navigate to the [Parcel posting](https://www.postaonline.cz/odvozy/odvozbaliku/secure/parametrybaliku) page on Czech Post website (you must be logged in).
1. You must first select COUNTRY manually. If you are sending a parcel to Czechia, select "Manual Input" for address input type.
1. Copy the addressee's contact information and paste it into the input field at the top of the page.
1. Navigate to the "Given Name" field of the addressee form. Press Control+V to copy the given name.
1. Navigate to the following fields and repeat pressing Control+V for each of them until the Phone number field.
1. Please check the correctness of the address before placing an order.

## Why cannot the fields be filled out automatically?

Unfortunately, using javascript to fill out the fields by manipulating their value directly from the extension does not work.
In the case of this manipulation, the values are not recorded properly by the Czech Post website, and validation of form data fails.

## Supported address formats

Formats currently supported by this extension are informed by the most commonly used two formats on Shopify:
Individual parts of the address can be comma-separated or new-line-separated.

```
# Used e.g. for Spain
name, street and number, [apt. number,] postal code + municipality, region, country, telephone

# Used e.g. for Canada
"name, street, municipality region postal code, country, telephone
```

If neither of these formats suit your needs, feel free to copy this extension's code and edit the logic to your needs.
