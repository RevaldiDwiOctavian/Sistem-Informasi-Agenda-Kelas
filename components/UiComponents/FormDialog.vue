<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          {{ submitButtonLabel }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-for="field in formFields" :key="field.name">
              <v-col cols="12">
                <div v-if="field.type == 'select'">
                  <v-select
                    :items="field.items"
                    item-text="nama"
                    item-value="id"
                    :label="field.label"
                    v-model="formData[field.name]"
                    required
                  ></v-select>
                </div>
                <div v-else>
                  <v-text-field
                    :label="field.label"
                    :type="field.type"
                    v-model="formData[field.name]"
                    required
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="submitForm"> Simpan </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    formFields: {
      type: Array,
      required: true,
    },
    submitButtonLabel: {
      type: String,
      default: 'Submit',
    },
  },

  data() {
    return {
      dialog: false,
      formData: {},
    }
  },
  methods: {
    submitForm() {
      this.dialog = false
      this.$emit('formSubmitted', this.formData)
      this.formData = {}
    },
  },
}
</script>
