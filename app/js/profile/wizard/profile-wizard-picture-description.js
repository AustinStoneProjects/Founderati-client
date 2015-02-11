/**
 * Created by austinstone on 2/10/15.
 */
var formField = require('common/form-builder').inputs.formField;
var validate = require('common/form-builder').validate;
var EditableImage = require('common/editable-image');

var ProfileWizardPictureDescription = function () {
  var profileWizardPictureDescription = {};

  var vm = {

    profilePicture: new EditableImage(),

    selectedFieldText: m.prop()
  };

  profileWizardPictureDescription.rules = {
    description: {
      identifier: 'description',
      rules: [
        { type: 'empty', prompt: "Please enter a description." }
      ]
    }
  };

  profileWizardPictureDescription.view  = function (ctrl) {

    return [
      m('div.ui.segment',  [
        m('a.ui.ribbon.label', 'Basic Info'),
        m('div.ui.hidden.divider'),
        m('div.ui.stackable.grid', [
          m('div.eight.wide.column', [
            m('h5','Please upload a profile picture'),
            m('div.ui.card', [
              vm.profilePicture.view({
                editable: true
              })
            ]),
            formField( {
              name: 'description',
              type: 'text',
              onchange: m.withAttr('value', ctrl.description),
              placeholder: 'Please enter a one sentence description of yourself.'
            }, 'Description', null, 'input')
          ])
        ])
      ])
    ];
  };

  return profileWizardPictureDescription;
};

module.exports = ProfileWizardPictureDescription;