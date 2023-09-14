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

    this.currentStep = 0;

    this.handleDragCallback = this.handleDragCallback.bind(this);
  }

  handleDragCallback(eventData) {
    const toolData = getToolState(eventData.element, this.name);

    if (!toolData || !toolData.data || !toolData.data.length) {
      return;
    }

    const data = toolData.data[0]; // Assuming you're working with the first measurement

    const { x, y } = eventData.currentPoints.image;

    switch (this.currentStep) {
      case 1:
        data.handles.heartEnd.x = x;
        data.handles.heartEnd.y = y;
        break;
      case 2:
        data.handles.chestStart.x = x;
        data.handles.chestStart.y = y;
        break;
      case 3:
        data.handles.chestEnd.x = x;
        data.handles.chestEnd.y = y;
        break;
      default:
        break;
    }
  }

  /**
   * Create a new CTI measurement.
   * @param {Object} eventData - Data for the event.
   * @returns {Object} The new measurement.
   */
  createNewMeasurement(eventData) {
    const { x, y } = eventData.currentPoints.image;

    // Initialize the measurement data if it's the first step
    if (this.currentStep === 0) {
      this.currentStep++;

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

    // Handle subsequent steps
    const toolData = getToolState(eventData.element, this.name);

    if (!toolData || !toolData.data || !toolData.data.length) {
      return;
    }

    const data = toolData.data[0]; // Assuming you're working with the first measurement

    switch (this.currentStep) {
      case 1:
        data.handles.heartEnd.x = x;
        data.handles.heartEnd.y = y;
        this.currentStep++;
        break;
      case 2:
        data.handles.chestStart.x = x;
        data.handles.chestStart.y = y;
        this.currentStep++;
        break;
      case 3:
        data.handles.chestEnd.x = x;
        data.handles.chestEnd.y = y;
        // Update the text box position
        data.handles.textBox.x = x;
        data.handles.textBox.y = y;
        // Invalidate the data to force an update
        data.invalidated = true;
        this.currentStep = 0; // Reset to allow new measurements
        break;
      default:
        break;
    }

    return data;
  }

  /**
   *
   *
   * @param {*} element
   * @param {*} data
   * @param {*} coords
   * @returns {Boolean}
   */
  pointNearTool(element, data, coords) {
    const hasStartAndEndHandles =
      data && data.handles && data.handles.start && data.handles.end;
    const validParameters = hasStartAndEndHandles;

    if (!validParameters) {
      logger.warn(
        `invalid parameters supplied to tool ${this.name}'s pointNearTool`
      );

      return false;
    }

    if (data.visible === false) {
      return false;
    }
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

        // Position the text box next to the chestEnd handle
        data.handles.textBox.x = data.handles.chestEnd.x - 150; // Adjust the '20' as needed
        data.handles.textBox.y = data.handles.chestEnd.y - 150;

        const text = textBoxText(data, digits);

        drawLinkedTextBox(
          context,
          element,
          data.handles.textBox,
          text,
          data.handles,
          () => [data.handles.chestEnd], // Pass the chestEnd handle as the anchor point
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
