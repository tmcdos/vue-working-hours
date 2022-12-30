<template>
  <v-app>
    <v-main class="pa-4">
      <v-checkbox v-model="enableWorkingHours" label="Enable working hours" hide-details color="primary" />
      <WorkHours :value="params" :disabled="!enableWorkingHours" interval="15" />
    </v-main>
  </v-app>
</template>

<script>
import WorkHours from '@/components/WorkHours.vue';

export default
{
  name: 'App',
  components:
    {
      WorkHours
    },
  data()
  {
    return {
      enableWorkingHours: false,
      params:
        {
          weekdays:
            {
              0: // Sunday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
              1: // Monday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
              2: // Tuesday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
              3: // Wednesday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
              4: // Thursday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
              5: // Friday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
              6: // Saturday
                {
                  enabled: false,
                  intervals: [
                    {
                      from: '08:00',
                      to: '17:00'
                    }
                  ]
                },
            }
        }
    };
  },
};
</script>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active
  {
    transition: all 0.15s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fade-enter,
  .fade-leave-active
  {
    opacity: 0;
    transform: translate(-2em, 0);
  }

  .flex-column
  {
    flex-direction: column;
  }

  .pointer
  {
    cursor: pointer;
  }

  .full-width
  {
    width: 100%;
  }

  .v-overlay.v-dialog .v-overlay__content
  {
    width: auto;
  }

  .v-input__prepend-inner,
  .v-input__append-inner
  {
    margin-top: 0 !important;
    align-self: stretch !important;
    align-items: center;
    padding: 0 !important;
  }

</style>
