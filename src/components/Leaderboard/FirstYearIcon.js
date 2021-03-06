/* eslint-disable no-magic-numbers */// Defining named constants in this case actually hurts readability





import moment from 'moment'
import React from 'react'





import FirstYearSvg from '../svg/FirstYearSvg'





function FirstYearIcon ({ createdAt, ...iconProps }) {
  return moment(createdAt).isBefore('2016-01-01', 'year') && (
    <div
      className="achievement first-year"
      title="This rat joined in our first year of operation!">
      <FirstYearSvg className="size-32 fixed" {...iconProps} />
    </div>
  )
}





export default FirstYearIcon
