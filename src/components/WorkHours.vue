<template>
  <div>
    <div class="d-flex">
      <v-btn
        v-for="day in weekdays" :key="'w'+day.key"
        :outlined="!(days[day.key] || {}).enabled"
        :color="(days[day.key] || {}).enabled ? 'primary' : 'grey'"
        :disabled="disabled"
        class="v-btn--icon mr-3"
        size="small"
        @click="toggleDay(day.key)"
      >
        {{ day.value[0] }}
      </v-btn>
    </div>
    <table class="mt-2">
      <tbody>
        <tr v-for="day in weekdays" :key="'d'+day.key">
          <td class="text-subtitle-1 py-1 pr-2">{{ day.value }}</td>
          <td class="pb-1">
            <div v-for="(frame,index) in (days[day.key] || {}).intervals" :key="'if'+index" class="d-flex align-start pt-1">
              <v-text-field
                v-model="frame.from" variant="outlined" background-color="filler" hide-details="auto" maxlength="5" density="compact"
                :list="'from_'+index+'_'+day.key+'_'+uid"
                :disabled="disabled || !(days[day.key] || {}).enabled" style="min-width: 80px;" class="work-hour-value"
                :rules="[requiredValue,validTime]"
                @focus="onFocus"
              />
              <datalist :id="'from_'+index+'_'+day.key+'_'+uid">
                <option v-for="(opt,optionIndex) in intervalOptions" :key="'pf_'+optionIndex+'_'+day.key" :value="opt">{{ opt }}</option>
              </datalist>
              <div class="pa-2">to</div>
              <v-text-field
                v-model="frame.to" variant="outlined" background-color="filler" hide-details="auto" maxlength="5" density="compact"
                :list="'to_'+index+'_'+day.key+'_'+uid"
                :disabled="disabled || !(days[day.key] || {}).enabled" style="min-width: 80px;" class="work-hour-value"
                :rules="[requiredValue,validTime,validEndTime[day.key+'_'+index]]"
                @focus="onFocus"
              />
              <datalist :id="'to_'+index+'_'+day.key+'_'+uid">
                <option v-for="(opt,optionIndex) in possibleIntervalOptions(frame.from)" :key="'pt'+optionIndex+'_'+day.key" :value="opt">{{ opt }}</option>
              </datalist>
            </div>
          </td>
          <td>
            <div v-for="(frame,index) in (days[day.key] || {}).intervals" :key="'a'+index+'_'+day.key" class="pb-1">
              <v-btn icon :disabled="disabled || !(days[day.key] || {}).enabled" size="small" class="ml-2 mr-1" @click="addRemoveInterval(day.key,index)">
                <v-icon size="x-large" :color="index ? 'error' : 'success'">{{ index ? icons.mdiMinusCircleOutline : icons.mdiPlusCircleOutline }}</v-icon>
              </v-btn>
            </div>
          </td>
          <td>
            <v-btn variant="text" color="primary" :disabled="disabled || !(days[day.key] || {}).enabled" @click="copyTime(day.key)">
              <v-icon class="mr-2">{{ icons.mdiContentCopy }}</v-icon>
              Copy time to all
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mdiContentCopy, mdiPlusCircleOutline, mdiMinusCircleOutline } from '@mdi/js';

let uid = 1;

export default
{
  name: 'WorkHours',
  props:
    {
      value:
        {
          /**
           * @typedef {{
           *   from: string,
           *   to: string
           * }} intervalSpec
           * @typedef {{
           *   enabled: Boolean,
           *   intervals: intervalSpec[]
           * }} weekdayItem
           * @typedef {{
           *   0: weekdayItem,
           *   1: weekdayItem,
           *   2: weekdayItem,
           *   3: weekdayItem,
           *   4: weekdayItem,
           *   5: weekdayItem,
           *   6: weekdayItem,
           * }} weekdayItemGroup
           * @typedef {{
           *   weekdays: weekdayItemGroup
           * }} workingHours
           */
          type: Object, // @workingHours
          required: true
        },
      disabled:
        {
          // globally disable the component
          type: Boolean,
          default: false
        },
      interval:
        {
          // Specifies the number of minutes inside each time interval
          type: [Number, String],
          default: 15,
          validator: (v) => Number(v) >= 1 && Number(v) <= 12 * 60 && /^[0-9]+$/.test(String(v)) // intervals can be no longer than 12 hours and must span over integer amount of minutes
        },
    },
  data()
  {
    uid += 1;
    return {
      uid: `work-hours-${uid}` // we need unique IDs for the datalists - but we must anticipate our component can be instantiated multiple times, so we can't hardcode ID in the template
    };
  },
  computed:
    {
      icons()
      {
        // we import only the needed MDI icons instead of the whole MDI font to save significant amount of bytes
        return {
          mdiContentCopy,
          mdiPlusCircleOutline,
          mdiMinusCircleOutline,
        };
      },
      days()
      {
        return (this.value || {}).weekdays || {};
      },
      weekdays()
      {
        return [
          {
            key: 1,
            value: 'Monday',
          },
          {
            key: 2,
            value: 'Tuesday',
          },
          {
            key: 3,
            value: 'Wednesday',
          },
          {
            key: 4,
            value: 'Thursday',
          },
          {
            key: 5,
            value: 'Friday',
          },
          {
            key: 6,
            value: 'Saturday',
          },
          {
            key: 0,
            value: 'Sunday',
          },
        ];
      },
      intervalOptions()
      {
        // generate the begin/from time for all possible time intervals - according to the interval size component prop
        let minutes = 0;
        const result = [];
        while (minutes < 24 * 60)
        {
          result.push(this.formatTime(minutes));
          minutes += +this.interval; // coerce String to Number
        }
        return result;
      },
      validEndTime()
      {
        const result = {};
        Object.entries((this.value || {}).weekdays || {}).forEach(([dayID, weekday]) =>
        {
          (weekday.intervals || []).forEach((interval, index) =>
          {
            result[dayID + '_' + index] = (val) =>
            {
              const from = (interval.from || '').split(':');
              const to = (val || '').split(':');
              return from[0] * 60 + from[1] * 1 < to[0] * 60 + to[1] * 1 || 'From is after To';
            };
          });
        });
        return result;
      }
    },
  methods:
    {
      /**
       * Formats the number of minutes into HH:mm with leading zeroes
       * @param minutes {number}
       * @returns {string}
       */
      formatTime(minutes)
      {
        const mins = minutes % 60;
        const hours = (minutes - mins) / 60;
        return String(hours).padStart(2, '0') + ':' + String(mins).padStart(2, '0');
      },
      /**
       * Enables/disables the given weekday
       * @param dayID {number|string} Weekday (0-6)
       */
      toggleDay(dayID)
      {
        const weekday = ((this.value || {}).weekdays || {})[dayID] || {};
        weekday.enabled = !weekday.enabled;
      },
      /**
       * Make all days use the same time frames as the given day
       * @param dayID {number|string}
       */
      copyTime(dayID)
      {
        const intervals = (((this.value || {}).weekdays || {})[dayID] || {}).intervals || [];
        // first copy intervals to all enabled weekdays
        Object.values((this.value || {}).weekdays).forEach(weekday =>
        {
          if (weekday.enabled)
          {
            weekday.intervals = intervals.map(item => ({
              from: String(Number(item.from)).padStart(2, '0'),
              to: String(Number(item.to)).padStart(2, '0'),
            }));
          }
        });
        // then add leading zeroes, if missing
        intervals.forEach(item =>
        {
          item.from = String(Number(item.from)).padStart(2, '0');
          item.to = String(Number(item.to)).padStart(2, '0');
        });
      },
      /**
       * Either append new standard interval for the given weekday (when intervalIndex === 0)
       * or remove the given interval (when intervalIndex > 0)
       * @param dayID {number|string} Weekday (0-6)
       * @param intervalIndex {number} Index of the interval inside "intervals" array of the given weekday
       */
      addRemoveInterval(dayID, intervalIndex)
      {
        const weekday = ((this.value || {}).weekdays || {})[dayID] || {};
        if (intervalIndex)
        {
          (weekday.intervals || []).splice(intervalIndex, 1);
        }
        else
        {
          (weekday.intervals || []).push({
            from: '08:00',
            to: '17:00'
          });
        }
      },
      /**
       * Returns only those TO values which are greater than the corresponding FROM
       * @param from {string}
       * @returns string[]
       */
      possibleIntervalOptions(from)
      {
        const temp = (from || '').split(':');
        const minimum = temp[0].padStart(2, '0') + ':' + temp[1].padStart(2, '0');
        return this.intervalOptions.filter(item => item > minimum);
      },
      requiredValue(val)
      {
        return !!val || 'Required field';
      },
      validTime(val)
      {
        return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5]?[0-9]$/.test(val || '') || 'Must be HH:mm';
      },
      // when focusing FROM/TO - automatically select the value so that if you start typing it will replace the old value
      // and thus save you the operation of first deleting the old value
      onFocus(event)
      {
        event.target.select();
      }
    }
};
</script>

<style lang="scss">
.work-hour-value
{
  .v-field__input
  {
    padding-right: 0;
  }
}
</style>
