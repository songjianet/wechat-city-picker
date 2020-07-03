import city from './assets/area'

const defaultCode = [110000, 110100, 110101]

Component({
  properties: {
    value: {
      type: Array
    },
    color: {
      type: String,
      value: '#5fbf55'
    },
    height: {
      type: Number || String,
      value: 600
    },
    returnType: {
      type: String,
      value: 'polymerization'
    }
  },

  data: {
    province: [], // 所有省列表
    city: [], // 当前省下的所有市
    area: [], // 当前市下所有区
    selectCityIndex: [], // 选中城市对应省、市、区数组中的下标
    selectCityCode: [] // 选中城市对应省、市、区的code
  },

  lifetimes: {
    attached() {
      if (this.properties.returnType !== 'polymerization' && this.properties.returnType !== 'dispersed') {
        // eslint-disable-next-line no-console
        console.error(
          'Area picker Error: \nThe ReturnType object passed in an error value. ' +
          'It is allowed to pass in polymerization or dispersed, ' +
          'which represents aggregate return and decentralized return respectively.'
        )
      }

      this.setData({
        selectCityCode: this.properties.value.length < 1 ? defaultCode : this.properties.value
      })
      this._getDefaultCity()
    }
  },

  methods: {
    /**
     * 渲染默认选中的省市区
     * */
    _getDefaultCity() {
      this.data.province = []
      this.data.city = []
      this.data.area = []

      // 渲染省列表
      // eslint-disable-next-line guard-for-in
      for (const i in city['100000']) {
        // eslint-disable-next-line radix
        this.data.province.push({code: parseInt(i), name: city['100000'][i]})
        this.setData({province: this.data.province})
      }

      // 渲染市列表
      this.setData({city: this._calcCityAndArea(this.data.selectCityCode, 0)})

      // 渲染区列表
      this.setData({area: this._calcCityAndArea(this.data.selectCityCode, 1)})

      this.setData({
        selectCityIndex: [
          this._getIndex(this.data.province, this.data.selectCityCode[0]),
          this._getIndex(this.data.city, this.data.selectCityCode[1]),
          this._getIndex(this.data.area, this.data.selectCityCode[2])
        ]
      })
    },

    /**
     * 通过省code计算该省下的市，通过市code计算该市下的区
     * @param {Array} data 传入的默认选中和选中后的省、市、区下标数组
     * @param {Number} index 传入0为计算市，传入1为计算区
     * @return {Array} 返回处理后的数据格式
     * */
    _calcCityAndArea(data, index) {
      let temp
      // eslint-disable-next-line prefer-const
      temp = []
      for (const i in city) {
        // eslint-disable-next-line radix
        if (parseInt(i) === parseInt(data[index])) {
          // eslint-disable-next-line guard-for-in
          for (const j in city[i]) {
            // eslint-disable-next-line radix
            temp.push({code: parseInt(j), name: city[i][j]})
          }
        }
      }
      return temp
    },

    /**
     * 将省市区code转换为对应数组中的下标，作用于picker-view的选中
     * @param {Array} d 传入的省、市、区处理后的数组
     * @param {Number} v 传入选中省、市、区的code
     * @return {Number} 返回通过省、市、区code在处理后数组中的下标
     * */
    _getIndex(d, v) {
      let temp = null
      d.forEach((item, index) => {
        if (item.code === v) {
          temp = index
        }
      })
      return temp
    },

    _change(e) {
      try {
        let tProvince
        let tCity
        let tArea
        // eslint-disable-next-line prefer-const
        tProvince = this.data.province[e.detail.value[0]].code
        // eslint-disable-next-line prefer-const
        tCity = this.data.city[e.detail.value[1]].code
        // eslint-disable-next-line prefer-const
        tArea = this.data.area[e.detail.value[2]].code
        if (tProvince !== this.data.selectCityCode[0]) {
          this.setData({
            selectCityIndex: [e.detail.value[0], 0, 0]
          })
          this.data.selectCityCode = [tProvince, tProvince + 100, tProvince + 101]
        } else if (tCity !== this.data.selectCityCode[1]) {
          this.setData({
            selectCityIndex: [e.detail.value[0], e.detail.value[1], 0]
          })
          this.data.selectCityCode = [tProvince, tCity, tCity + 1]
        } else if (tArea !== this.data.selectCityCode[2]) {
          this.setData({
            selectCityIndex: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
          })
          this.data.selectCityCode = [tProvince, tCity, tArea]
        }
        this.setData({
          city: this._calcCityAndArea(this.data.selectCityCode, 0),
          area: this._calcCityAndArea(this.data.selectCityCode, 1),
          selectCityCode: this.data.selectCityCode
        })
        // eslint-disable-next-line no-catch-shadow
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },

    _cancel() {
      this.triggerEvent('cancel') // 向外抛出cancel事件
    },

    _confirm() {
      let data
      const selectCityName = []

      this.data.selectCityCode.forEach((item, index) => {
        if (index === 0) {
          selectCityName.push(this.data.province[this.data.selectCityIndex[index]].name)
        } else if (index === 1) {
          selectCityName.push(this.data.city[this.data.selectCityIndex[index]].name)
        } else {
          selectCityName.push(this.data.area[this.data.selectCityIndex[index]].name)
        }
      })

      if (this.properties.returnType === 'polymerization') {
        data = this.data.selectCityCode.map((item, index) => ({
          code: item,
          name: selectCityName[index]
        }))
      } else {
        data = {
          code: this.data.selectCityCode,
          name: selectCityName
        }
      }

      this.triggerEvent('confirm', data)
    }
  }
})
