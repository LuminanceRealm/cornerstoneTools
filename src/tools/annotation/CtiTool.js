import BaseAnnotationTool from '../base/BaseAnnotationTool.js';
import { getToolState } from './../../stateManagement/toolState.js';
import toolColors from './../../stateManagement/toolColors.js';
import { getNewContext, draw, drawLine } from './../../drawing/index.js';
import drawLinkedTextBox from './../../drawing/drawLinkedTextBox.js';
import drawHandles from './../../drawing/drawHandles.js';
import { getLogger } from '../../util/logger.js';
import getPixelSpacing from '../../util/getPixelSpacing';
import throttle from '../../util/throttle';

const logger = getLogger('tools:annotation:CTITool');

/**
 * CTITool - Tool for measuring the Cardiothoracic Index.
 * @extends BaseAnnotationTool
 */
export default class CTITool extends BaseAnnotationTool {
  /**
   * @constructor
   * @param {Object} [props] - The properties.
   */
  constructor(props = {}) {
    const defaultProps = {
      name: 'CTI',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        drawHandles: true,
        drawHandlesOnHover: false,
        hideHandlesIfMoving: false,
        renderDashed: false,
        digits: 2,
      },
    };

    super(props, defaultProps);

    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
  }

  /**
   * Create a new CTI measurement.
   * @param {Object} eventData - Data for the event.
   * @returns {Object} The new measurement.
   */
  createNewMeasurement(eventData) {
    const { x, y } = eventData.currentPoints.image;

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        heartStart: { x, y, highlight: true, active: false },
        heartEnd: { x, y, highlight: true, active: true },
        chestStart: { x, y, highlight: true, active: false },
        chestEnd: { x, y, highlight: true, active: false },
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true,
        },
      },
    };
  }

  /**
   * Update the cached CTI statistics.
   * @param {Object} image - The image data.
   * @param {Object} element - The DOM element.
   * @param {Object} data - The measurement data.
   */
  updateCachedStats(image, element, data) {
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    const dxHeart =
      (data.handles.heartEnd.x - data.handles.heartStart.x) *
      (colPixelSpacing || 1);
    const dxChest =
      (data.handles.chestEnd.x - data.handles.chestStart.x) *
      (colPixelSpacing || 1);

    const cti = (dxHeart / dxChest) * 100;

    data.cti = cti;
    data.invalidated = false;
  }

  /**
   * Render the CTI tool data.
   * @param {Object} evt - The event.
   */
  renderToolData(evt) {
    const { detail: eventData } = evt;
    const { digits } = this.configuration;
    const toolData = getToolState(evt.currentTarget, this.name);

    if (!toolData) {
      return;
    }

    const context = getNewContext(eventData.canvasContext.canvas);
    const { image, element } = eventData;

    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      draw(context, context => {
        const color = toolColors.getColorIfActive(data);

        drawLine(
          context,
          element,
          data.handles.heartStart,
          data.handles.heartEnd,
          { color }
        );
        drawLine(
          context,
          element,
          data.handles.chestStart,
          data.handles.chestEnd,
          { color }
        );

        drawHandles(context, eventData, data.handles, { color });

        if (data.invalidated === true) {
          this.throttledUpdateCachedStats(image, element, data);
        }

        const text = textBoxText(data, digits);

        drawLinkedTextBox(
          context,
          element,
          data.handles.textBox,
          text,
          data.handles,
          color
        );
      });
    }

    /**
     * Generate the text to display in the text box.
     * @param {Object} annotation - The annotation data.
     * @param {number} digits - The number of digits to display.
     * @returns {string} The text to display.
     */
    function textBoxText(annotation, digits) {
      const measuredValue = _sanitizeMeasuredValue(annotation.cti);

      if (!measuredValue) {
        return '';
      }

      annotation.unit = '%';

      return `${measuredValue.toFixed(digits)} ${annotation.unit}`;
    }
  }
}

/**
 * Sanitize the measured value.
 * @param {*} value - The value to sanitize.
 * @returns {number|undefined} The sanitized value.
 */
function _sanitizeMeasuredValue(value) {
  const parsedValue = Number(value);
  const isNumber = !isNaN(parsedValue);

  return isNumber ? parsedValue : undefined;
}
