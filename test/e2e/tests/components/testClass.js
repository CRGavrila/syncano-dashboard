import instances from '../../tempInstances';
import utils, { addTestNamePrefixes } from '../../utils';

export default addTestNamePrefixes({
  tags: ['class'],
  before: (client) => {
    const { account_key: accountKey } = instances.account;

    client
      .loginUsingLocalStorage(accountKey)
      .setResolution(client);
  },
  after: (client) => client.end(),
  'Test Add Class': (client) => {
    const classesPage = client.page.classesPage();
    const className = utils.addSuffix('class');
    const { instanceName } = instances.secondInstance;

    classesPage
      .goToUrl(instanceName, 'classes')
      .clickElement('@addClassButton')
      .fillInput('@createModalNameInput', className)
      .fillInput('@createModalDescriptionInput', utils.addSuffix())
      .fillInput('@createModalFieldNameInput', 'string')
      .clickElement('@addButton')
      .clickElement('@confirmButton')
      .clickElement('@summaryDialogCloseButton')
      .waitForElementNotPresent('@addClassTitle')
      .waitForElementVisible('@classTableRow')
      .verify.containsText('@classTableRowDescription', utils.addSuffix());
  },
  'Test Edit Class': (client) => {
    const classesPage = client.page.classesPage();
    const edit = utils.addSuffix('edit');

    classesPage
      .clickElement('@classesListItemDropDown')
      .clickElement('@editButton')
      .fillInput('@createModalDescriptionInput', edit)
      .clickElement('@confirmButton')
      .clickElement('@summaryDialogCloseButton');

    // Pause as dashboard may refresh itself thus random failes
    client.pause(1500);

    classesPage
      .waitForElementVisible('@classTableRowDescription')
      .verify.containsText('@classTableRowDescription', edit);
  },
  'Test Delete Class': (client) => {
    const classesPage = client.page.classesPage();

    classesPage
      .clickElement('@classesListItemDropDown')
      .clickElement('@deleteButton')
      .waitForElementVisible('@deleteClassModalTitle')
      .clickElement('@confirmDeleteButton')
      .waitForElementNotPresent('@deleteClassModalTitle')
      .waitForElementNotPresent('@classTableName');
  },
  'Test Admin selects/deselects class': (client) => {
    const listsPage = client.page.listsPage();
    const selectedItem = listsPage.elements.selectedItem.selector;
    const optionsMenu = listsPage.elements.firstItemOptionsMenu.selector;

    client.singleItemSelectUnselect('synicon-cloud', optionsMenu, selectedItem);
  },
  'Test Admin cannot delete user_profile class': (client) => {
    const classesPage = client.page.classesPage();

    classesPage
      .clickElement('@userClassDropDown', client)
      .waitForElementVisible('@inactiveDeleteButton')
      .assert.attributeContains('@inactiveDeleteButton', 'style', 'cursor: not-allowed');
  }
});
