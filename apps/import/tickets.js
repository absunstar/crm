module.exports = function (site) {

    const $tickets = site.connectCollection('tickets')
    const $damages = site.connectCollection('damages')
    const $devices_names = site.connectCollection('devices_names')
    const $customers = site.connectCollection('customers')
    const $employees = site.connectCollection("employees")


    function importTickets(__id, __count) {

        site.import_result['info'] = 'Geting ID : ' + __id + ' , TO : ' + (__id + __count)

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {

            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                sql.close()
                return
            }

            let request = new sql.Request();



            request.query(`SELECT TOP (100000) * FROM [MainDatabase].[dbo].[MainApp_Complaints] where ID < ${ __id + __count + 1} and ID > ${__id} `, function (err, result) {

                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    sql.close()
                    return
                }

                let tickets = result.recordset
                site.import_result['tickets_count'] = tickets.length

                request.query('SELECT TOP (1000000) [ID],[Name],[CompanyID],[DeviceID],[ProductID],[Name2] FROM [MainDatabase].[dbo].[MainApp_Models]', function (err, result) {

                    if (err) {
                        console.log(err)
                        site.import_result['error'] = err.message
                        sql.close()
                        return
                    }

                    let models = result.recordset
                    site.import_result['models_count'] = models.length
                    sql.close()

                    tickets.forEach((ticket, i) => {
                        let _t = {
                            id: ticket.ID,
                            is_old_data: true,
                            code: ticket.Code,
                            receipt_number: ticket.BillNo,
                            date: new Date(ticket.ReceivedDate),
                            visit_date: new Date(ticket.SuggestDate),
                            complain: ticket.Complaint,
                            company_codes: [],
                            notes: [],
                            eng: {
                                id: ticket.TechnicianID || 0
                            },
                            damage: {
                                id: ticket.ComplaintTypeID
                            },
                            device_info: {
                                device: {
                                    id: ticket.ProductID
                                },
                                serial: ticket.SerialNo || '',
                                product_date: ticket.FullBarcode || ''
                            },
                            customer: {
                                id: ticket.CustomerID
                            },
                            fixes: ticket.Repars || '',
                            print_count: ticket.IsPrint ? 1 : 0,
                            close_eng: {
                                fixes: ticket.Repars || ''
                            },
                            done: true,
                            status: {
                                "id": 3,
                                "ar": "مغلق بدون قطع غيار",
                                "en": "s3"
                            }
                        }

                        if (ticket.SapNo) {
                            _t.company_codes.push(ticket.SapNo);
                        }

                        if (ticket.CustomerNotes) {
                            _t.notes.push(ticket.CustomerNotes);
                        }

                        if (ticket.PrimaryNotes) {
                            _t.notes.push(ticket.PrimaryNotes);
                        }

                        if (ticket.AgentNotes) {
                            _t.notes.push(ticket.AgentNotes);
                        }

                        if (ticket.SparePartsRepairs) {
                            _t.notes.push(ticket.SparePartsRepairs);
                        }
                        if (ticket.SuggestDateNotes) {
                            _t.notes.push(ticket.SuggestDateNotes);
                        }



                        if (ticket.Revenues) {
                            _t.close_eng.fixes += ' - ' + ' وتم تحصيل مبلغ ' + ticket.Revenues + ' جنية ';
                            _t.fixes += ' - ' + ' وتم تحصيل مبلغ ' + ticket.Revenues + ' جنية ';
                        }

                        if (ticket.SparePartsRepairs) {
                            _t.close_eng.fixes += ' - ' + ticket.SparePartsRepairs;
                            _t.fixes += ' - ' + ticket.SparePartsRepairs;
                        }

                        if (ticket.StatusTypeID == 1) {
                            _t.status = {
                                "id": 1,
                                "ar": "مفتوح",
                                "en": "s1"
                            }
                        } else if (ticket.StatusTypeID == 2) {
                            _t.status = {
                                "id": 4,
                                "ar": "موزع",
                                "en": "s4"
                            }
                        } else if (ticket.StatusTypeID == 3) {
                            _t.status = {
                                "id": 6,
                                "ar": "مؤجل قطع غيار",
                                "en": "s6"
                            }
                        } else if (ticket.StatusTypeID == 4) {
                            _t.status = {
                                "id": 3,
                                "ar": "مغلق بدون قطع غيار",
                                "en": "s3"
                            }
                        } else if (ticket.StatusTypeID == 5) {
                            _t.status = {
                                "id": 5,
                                "ar": "ملغى",
                                "en": "s5"
                            }
                        } else if (ticket.StatusTypeID == 6) {
                            _t.status = {
                                "id": 7,
                                "ar": "مؤجل طرف عميل",
                                "en": "s7"
                            }
                        } else if (ticket.StatusTypeID == 7) {
                            _t.status = {
                                "id": 3,
                                "ar": "مغلق بدون قطع غيار",
                                "en": "s3"
                            }
                        } else if (ticket.StatusTypeID == 8) {
                            _t.status = {
                                "id": 2,
                                "ar": "مغلق بقطع غيار",
                                "en": "s2"
                            }
                        } else if (ticket.StatusTypeID == 9) {
                            _t.status = {
                                "id": 7,
                                "ar": "مؤجل طرف عميل",
                                "en": "s7"
                            }
                        } else if (ticket.StatusTypeID == 10) {
                            _t.status = {
                                "id": 6,
                                "ar": "مؤجل قطع غيار",
                                "en": "s6"
                            }
                        } else if (ticket.StatusTypeID == 11) {
                            _t.status = {
                                "id": 11,
                                "ar": "مؤجل لاتصال العميل",
                                "en": "s11"
                            }
                        } else if (ticket.StatusTypeID == 12) {
                            _t.status = {
                                "id": 11,
                                "ar": "مؤجل لاتصال العميل",
                                "en": "s11"
                            }
                        } else if (ticket.StatusTypeID == 13) {
                            _t.status = {
                                "id": 8,
                                "ar": "سحب للورشة",
                                "en": "s8"
                            }
                        } else if (ticket.StatusTypeID == 14) {
                            _t.status = {
                                "id": 8,
                                "ar": "سحب للورشة",
                                "en": "s8"
                            }
                        } else if (ticket.StatusTypeID == 15) {
                            _t.status = {
                                "id": 9,
                                "ar": "سحب للشركة",
                                "en": "s9"
                            }
                        } else if (ticket.StatusTypeID == 16) {
                            _t.status = {
                                "id": 8,
                                "ar": "سحب للورشة",
                                "en": "s8"
                            }
                            _t.status3 = {
                                "id": 6,
                                "ar": "مفتوح",
                                "en": "Open"
                            }
                        } else if (ticket.StatusTypeID == 17) {
                            _t.status = {
                                "id": 8,
                                "ar": "سحب للورشة",
                                "en": "s8"
                            }
                            _t.status3 = {
                                "id": 1,
                                "ar": "الجهاز قيد التسليم",
                                "en": "Proccing"
                            }
                        } else if (ticket.StatusTypeID == 18) {
                            _t.status = {
                                "id": 8,
                                "ar": "سحب للورشة",
                                "en": "s8"
                            }
                            _t.status3 = {
                                "id": 3,
                                "ar": "مغلق",
                                "en": "Closed"
                            }
                        } else if (ticket.StatusTypeID == 19) {
                            _t.status = {
                                "id": 8,
                                "ar": "سحب للورشة",
                                "en": "s8"
                            }
                            _t.status3 = {
                                "id": 2,
                                "ar": "مؤجل قطع غيار",
                                "en": "Need Items"
                            }
                        } else if (ticket.StatusTypeID == 20) {
                            _t.status = {
                                "id": 3,
                                "ar": "مغلق بدون قطع غيار",
                                "en": "s3"
                            }
                        } else if (ticket.StatusTypeID == 21) {
                            _t.status = {
                                "id": 15,
                                "ar": "الكهرباء مقطوعة",
                                "en": "s15"
                            }
                        } else if (ticket.StatusTypeID == 22) {
                            _t.status = {
                                "id": 7,
                                "ar": "مؤجل طرف عميل",
                                "en": "s7"
                            }
                        } else if (ticket.StatusTypeID == 23) {
                            _t.status = {
                                "id": 5,
                                "ar": "ملغى",
                                "en": "s5"
                            }
                        } else if (ticket.StatusTypeID == 24) {
                            _t.status = {
                                "id": 5,
                                "ar": "ملغى",
                                "en": "s5"
                            }
                        } else {
                            _t.status = {
                                "id": 3,
                                "ar": "مغلق بدون قطع غيار",
                                "en": "s3"
                            }
                        }

                        _t.old_ticket = ticket

                        $tickets.add(_t, (err, doc) => {
                            if (!err && doc) {

                                console.log(` ( ${i+1} ) Tickets Added : ${doc.code}`)
                                site.import_result['ticket_id'] = doc.id
                                site.import_result['ticket_code'] = doc.code

                                $employees.get({
                                    id: doc.eng.id
                                }, (err, eng1) => {
                                    if (!err && eng1) {
                                        doc.eng = {
                                            id: eng1.id,
                                            name: eng1.name
                                        }
                                        doc.close_eng.eng = {
                                            id: eng1.id,
                                            name: eng1.name
                                        }
                                        $tickets.update(doc)
                                    }
                                })



                                $damages.get({
                                    id: doc.damage.id
                                }, (err, d1) => {
                                    if (!err && d1) {
                                        doc.damage = {
                                            id: d1.id,
                                            name: d1.name
                                        }
                                        $tickets.update(doc)
                                    }
                                })



                                $devices_names.get({
                                    id: doc.device_info.device.id
                                }, (err, d2) => {
                                    if (!err && d2) {

                                        doc.device_info.status = ticket.IsWarranty ? 1 : 0
                                        doc.device_info.company = d2.company
                                        doc.device_info.category = d2.category
                                        doc.device_info.sub_category = d2.sub_category
                                        doc.device_info.device = {
                                            id: d2.id,
                                            name: d2.name
                                        }
                                        if (ticket.ModelID) {

                                        }
                                        models.forEach(mo => {
                                            if (ticket.ModelID == mo.ID) {
                                                doc.device_info.model = {
                                                    id: mo.ID,
                                                    name: mo.Name,
                                                    alt: mo.Name2
                                                }
                                            }
                                        })
                                        $tickets.update(doc, () => {
                                            $customers.get({
                                                id: doc.customer.id
                                            }, (err, c1) => {
                                                if (!err && c1) {
                                                    c1.devices = c1.devices || []
                                                    let cd_exists = false
                                                    c1.devices.forEach(cd => {
                                                        if (cd.company && cd.company.id == doc.device_info.company.id) {
                                                            if (cd.category && cd.category.id == doc.device_info.category.id) {
                                                                if (cd.sub_category && cd.sub_category.id == doc.device_info.sub_category.id) {
                                                                    if (cd.device && cd.device.id == doc.device_info.device.id) {
                                                                        cd_exists = true
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                    if (!cd_exists) {
                                                        c1.devices.push(doc.device_info)
                                                        $customers.update(c1)
                                                    }
                                                    doc.customer = {
                                                        id: c1.id,
                                                        name: c1.name,
                                                        gov: c1.gov,
                                                        city: c1.city,
                                                        region: c1.region,
                                                        town: c1.town,
                                                        address: c1.address,
                                                        phones: c1.phones,
                                                        mobiles: c1.mobiles
                                                    }
                                                    $tickets.update(doc)
                                                }
                                            })
                                        })

                                    }
                                })



                            } else {
                                console.log(err)
                                site.import_result['error'] = err.message
                            }

                        })
                    })



                })
            })

        })
    }


    function removeTickets() {

        site.import_result['info'] = 'start Removing Tickets'

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {

            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                sql.close()
                return
            }

            let request = new sql.Request();


            request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_SpareParts_Waitings]`, function (err, result) {

                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    return
                }

                site.import_result['info'] = 'deleted MainApp_SpareParts_Waitings'

                request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_SpareParts_Complaints]`, function (err, result) {

                    if (err) {
                        console.log(err)
                        site.import_result['error'] = err.message
                        return
                    }

                    site.import_result['info'] = 'deleted MainApp_SpareParts_Complaints'


                    request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_SpareParts_Warranties]`, function (err, result) {

                        if (err) {
                            console.log(err)
                            site.import_result['error'] = err.message
                            return
                        }

                        site.import_result['info'] = 'deleted MainApp_SpareParts_Warranties'



                        request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_SpareParts_Responsibility_Damaged_DTLs]`, function (err, result) {

                            if (err) {
                                console.log(err)
                                site.import_result['error'] = err.message
                                return
                            }

                            site.import_result['info'] = 'deleted MainApp_SpareParts_Responsibility_Damaged_DTLs'


                            request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_SpareParts_Not_Warranties]`, function (err, result) {

                                if (err) {
                                    console.log(err)
                                    site.import_result['error'] = err.message
                                    return
                                }

                                site.import_result['info'] = 'deleted MainApp_SpareParts_Not_Warranties'



                                request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_Complaint_Distributs]`, function (err, result) {

                                    if (err) {
                                        console.log(err)
                                        site.import_result['error'] = err.message
                                        return
                                    }

                                    site.import_result['info'] = 'deleted MainApp_Complaint_Distributs'
                                    

                                    request.query(`delete FROM [MainDatabase].[dbo].[MainApp_Complaints_Tech_Temps]`, function (err, result) {

                                        if (err) {
                                            console.log(err)
                                            site.import_result['error'] = err.message
                                            return
                                        }

                                        site.import_result['info'] = 'deleted MainApp_Complaints_Tech_Temps'


                                        request.query(`delete  FROM [MainDatabase].[dbo].[MainApp_Complaints] where id < 300000`, function (err, result) {

                                            if (err) {
                                                console.log(err)
                                                site.import_result['error'] = err.message
                                                return
                                            }
    
                                            site.import_result['info'] = 'deleted MainApp_Complaints'
                                            site.import_result['info'] = result
    
    
                                            sql.close()
                                        })
                                    })
                                })
                            })
                        })
                    })
                })


            })
        })
    }

    function countTickets() {

        site.import_result['info'] = 'counting'

        let sql = require("mssql");

        sql.connect(site.sql_config, function (err) {

            if (err) {
                console.log(err)
                site.import_result['error'] = err.message
                sql.close()
                return
            }

            let request = new sql.Request();


            request.query(`SELECT count(id)  FROM [MainDatabase].[dbo].[MainApp_Complaints] `, function (err, result) {

                if (err) {
                    console.log(err)
                    site.import_result['error'] = err.message
                    sql.close()
                    return
                }

                let tickets = result.recordset
                site.import_result['info'] = result

                sql.close()
            })
        })
    }

    site.post('/api/import/tickets', (req, res) => {

        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);


        if (!site.security.isUserHasPermission(req, res, 'importTickets')) {
            site.import_result['error'] = 'you not have importTickets permission'
            return
        }

        let from_id = parseInt(req.data.from_id)
        let to_id = parseInt(req.data.to_id)
        let count = parseInt(req.data.count)

        importTickets(from_id, count)

        let tt = setInterval(() => {
            from_id += count
            importTickets(from_id)

            if (from_id > to_id) {
                clearInterval(tt)
            }

        }, 1000 * 60 * 3)

    })

    site.post('/api/drop/tickets', (req, res) => {

        $tickets.drop(() => {
            site.import_result['info'] = 'Droped Collection Tickets'
            setTimeout(() => {
                res.json({
                    done: true
                })
            }, 1000 * 3);

        })

    })

    site.post('/api/remove/tickets', (req, res) => {
        removeTickets()
        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);
    })

    
    site.post('/api/count/tickets', (req, res) => {
        countTickets()
        setTimeout(() => {
            res.json({
                done: true
            })
        }, 1000 * 3);
    })
}