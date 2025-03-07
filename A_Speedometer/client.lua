local display = false
local seatbeltOn = false -- Track seatbelt status manually


RegisterCommand("speedometer", function()
    display = not display
    SendNUIMessage({show = display})
    SetNuiFocus(display, display)
end)


CreateThread(function()
    while true do
        local playerPed = PlayerPedId()
        if IsPedInAnyVehicle(playerPed, false) then
            if IsControlJustPressed(0, 29) then -- Default seatbelt key (K)
                seatbeltOn = not seatbeltOn
                TriggerEvent("QBCore:Notify", "Seatbelt " .. (seatbeltOn and "On" or "Off"), "primary")
            end
        else
            seatbeltOn = false 
        end
        Wait(0)
    end
end)


CreateThread(function()
    while true do
        local playerPed = PlayerPedId()
        local veh = GetVehiclePedIsIn(playerPed, false)
        local isInCar = veh ~= 0 and GetPedInVehicleSeat(veh, -1) == playerPed

        if isInCar then
            local speed = math.floor(GetEntitySpeed(veh) * 3.6) -- Convert to KMH
            local fuel = math.floor(exports["LegacyFuel"]:GetFuel(veh)) 
            local engine = GetIsVehicleEngineRunning(veh)
            local belt = seatbeltOn



            SendNUIMessage({
                speed = speed,
                fuel = fuel,  
                engine = engine,
                belt = belt,
                inCar = true
            })
        else

            SendNUIMessage({
                speed = 0,
                fuel = 100,
                engine = false,
                belt = false,
                inCar = false
            })
        end
        Wait(500) 
    end
end)


RegisterNUICallback("close", function()
    display = false
    SendNUIMessage({show = false})
    SetNuiFocus(false, false)
end)
