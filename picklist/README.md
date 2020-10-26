# Syncing picklist values with transformations

This example transforms picklist data between a VDR and a particular vendor's own data model. 

## IMPORTANT NOTES
1. A VDR named `myContacts` contains a picklist field called `leadSource`.
2. The goal is to map the picklist field of `myContacts` to a similar field on an instance of the SalesForce Lead object.
3. Each picklist has similar but different values and different counts of options.
4. The transformation uses the custom javascript option found in the `<>` button on VDRs.
5. The custom javascript transformation needs to handle data flowing in both directions (`GET`/`POST`).
6. The direction of dataflow is determined by the `isVendor` object.

## Importing the VDR and transformation
There are two ways to import the VDR and transformation. You can use the UI (API docs) or Cloud Element's cli tool, the doctor.

### Import in the UI
1. Create the VDR.
    * Create the VDR by calling POST `/organizations/objects/myContacts/definitions` with this payload: [ObjectDefinition.json](myContacts/definition/objectDefinition.json), where the objectName is myContacts. You can find this API [here](https://my-staging.cloudelements.io/api-docs/platform/organizations).
2. Create the transformation for Salesforce.
    * Create the transformation for Salesforce by calling POST `/organizations/elements/sfdc/transformations/myContacts` with this payload: [transformation.json](myContacts/transformation/sfdc/transformation.json) (same page as above), where the keyOrId is `sfdc` and the objectName is `myContacts`.
3. You can now move on to the section below, **Code Explanation**.

### Import using the doctor
1. Ensure you have the correct version of the doctor installed locally. Run the command:
    ```
    npm i -g ce-util
    ```
    This will install the latest, non-beta version of the doctor. You can find full instructions [here](https://www.npmjs.com/package/ce-util) as well, as you might need to add an account if you are not already familiar with the doctor.
2. Import the VDR and transformation:
    * In the terminal, from the `PickList` directory, run the below command:
        ```
        doctor upload vdrs <accountNickName> -n myContacts -d . 
        ```
    This will import the VDR as well as the transformation into the account you specify.
    * **Note**: If you make changes the the VDR and want to save them locally, you can run `doctor download vdrs <accountsNickName> -n myContacts -d .` from your terminal to do so. This command will save your VDR to a directory with the same name as your VDR. You can alternatively specify your own directory name instead of the `.` after the `d` flag.
3. You can now move on to the section below, **Code Explanation**.

## Code Explanation
The transformation defines two javascript objects (`postPick` & `getPick`) that represent both sides of the equation and vary depending on `POST` or `GET`.

1. `getPick` : The keys of the `getPick` object are the options found in the Salesforce LeadSource picklist. 
    * Since we are 'getting' from Salesforce and transforming to `myContacts`, the `originalObject` is coming from Salesforce and will contain a value for LeadSource. We can therefore use LeadSource as a key to look up, set and return a value from the `getPick` object using bracket syntax to access the property's value.
        > getPick[originalObject.LeadSource]

2. `postPick` : The keys and values of the `postPick` object are the exact opposite of the `getPick` object with its keys representing options from `myContacts` and values representing the corresponding Salesforce options.
    * Note that the `postPick` object has one more key than `getPick` because there are more options on the `myContacts` picklist than the Salesforce equivalent. This allows us to map **two** `myContacts` keys (List & Event) to one Salesforce value, `Purchased List`. 
    * When posting to `myContacts`, the `originalObject` will be of the `myContacts` type and will therefore contain a value for `leadSource` (not LeadSource) and we can use that as a key to lookup, set and post the appropriate Salesforce value from the `postPick` object, again using bracket syntax:
        > postPick[originalObject.leadSource]

### Examples
#### `POST` Example
As an example with data, `POST` the below payload to your `myContacts` VDR (you can use the blue play symbol, aka the `Try It Out` feature). Because the `leadSource` value is `Event`, it will `POST` to Salesforce with the value for LeadSource of `Purchased List` because `postPick['Event']` will evaluate to `Purchased List`. You can see the results of this call in the response.
```
{ 
  "leadSource": "Event",
  "company": "The People Person's Paper People",
  "lastName": "Halpert",
  "firstName": "Jimothy"
}
```
#### `GET` Example
Conversely, if you `GET` a lead from the `myContacts` VDR (to get the lead above you just created, enter a WHERE clause of: `lastName='Halpert' AND firstName='Jimothy'`), you will be able to examine two response bodies, shown below. The **Raw Body** is what the vendor (Salesforce) returned. The **Transformed Body** is the response from Salesforce after the  `myContacts` VDR has normalized the data to your specifications. 

**Raw Body**
```
[
  {
    "Company": "Dunder Mifflin",
    "Email": null,
    "LastName": "Halpert",
    "LeadSource": "Purchased List",
    "FirstName": "Jimothy"
  }
]
```
**Transformed Body**
```
[
  {
    "lastName": "Halpert",
    "firstName": "Jimothy",
    "company": "Dunder Mifflin",
    "leadSource": "List"
  }
]
```
> Notice that `leadSource` is `List` (transformed from the LeadSource of the raw body above, which was `Purchased List`.)